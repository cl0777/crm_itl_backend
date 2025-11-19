import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { OtpModel } from './otp.model';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import * as nodemailer from 'nodemailer';
import { marked } from 'marked';
import { CustomerModel } from '../customers/customer.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
import { Op } from 'sequelize';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
    @InjectModel(OtpModel)
    private readonly otpModel: typeof OtpModel,
    @InjectModel(CustomerAccountModel)
    private readonly customerAccountModel: typeof CustomerAccountModel,
    @InjectModel(CustomerModel)
    private readonly customerModel: typeof CustomerModel,
  ) {}

  private buildTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || '0');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secureEnv = process.env.SMTP_SECURE;

    if (!host || !port || !user || !pass) {
      throw new InternalServerErrorException(
        'SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.',
      );
    }

    const secure =
      secureEnv !== undefined
        ? secureEnv.toLowerCase() === 'true'
        : port === 465;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000, // 10 seconds connection timeout
      greetingTimeout: 10000, // 10 seconds greeting timeout
      socketTimeout: 10000, // 10 seconds socket timeout
    } as any);
  }

  private getFromAddress() {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (!from) {
      throw new InternalServerErrorException(
        'SMTP_FROM or SMTP_USER must be configured.',
      );
    }
    return from;
  }

  async history(userId?: number) {
    const where = userId ? { userId } : {};
    return this.messageModel.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  async sendMail(
    dto: SendMailDto,
    attachments: Array<Express.Multer.File>,
    senderUserId: number,
  ) {
    console.log('sendMail', dto, attachments, senderUserId);
    const transporter = this.buildTransporter();
    const fromAddress = this.getFromAddress();

    const customers = await CustomerModel.findAll({
      where: { id: dto.customerIds },
      attributes: ['id', 'email', 'partyName'],
    });

    // Unique emails
    const seen = new Set<string>();
    const recipients = customers
      .map((c) => ({ email: String(c.email || '').trim(), name: c.partyName }))
      .filter((c) => c.email)
      .filter((c) => {
        const key = c.email.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const html = (await marked.parse(dto.bodyMarkdown || '')) as string;
    const text = (dto.bodyMarkdown || '').replace(/[#*_>`]/g, '');

    const nodemailerAttachments = (attachments || []).map((f) => ({
      filename: f.originalname,
      content: f.buffer,
      contentType: f.mimetype,
    }));

    const results: any[] = [];
    for (const r of recipients) {
      try {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: r.email,
          subject: dto.subject,
          text,
          html,
          attachments: nodemailerAttachments,
        });

        const saved = await this.messageModel.create({
          subject: dto.subject,
          bodyMarkdown: dto.bodyMarkdown,
          bodyHtml: html,
          fromEmail: String(fromAddress || ''),
          toEmail: r.email,
          attachmentsJson: JSON.stringify(
            nodemailerAttachments.map((a) => a.filename),
          ),
          status: 'sent',
          userId: senderUserId,
          sentAt: new Date(),
        });

        results.push({ to: r.email, messageId: info.messageId, id: saved.id });
      } catch (err: any) {
        await this.messageModel.create({
          subject: dto.subject,
          bodyMarkdown: dto.bodyMarkdown,
          bodyHtml: html,
          fromEmail: String(fromAddress || ''),
          toEmail: r.email,
          attachmentsJson: JSON.stringify(
            nodemailerAttachments.map((a) => a.filename),
          ),
          status: 'failed',
          errorMessage: String(err?.message || err),
          userId: senderUserId,
          sentAt: new Date(),
        });
        results.push({ to: r.email, error: String(err?.message || err) });
      }
    }

    return { count: results.length, results };
  }

  async sendNotificationEmail(
    toEmails: string[],
    subject: string,
    htmlBody: string,
    textBody?: string,
  ) {
    const transporter = this.buildTransporter();
    const fromAddress = this.getFromAddress();

    const results: any[] = [];
    for (const email of toEmails) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject,
          text: textBody || htmlBody.replace(/<[^>]*>/g, ''),
          html: htmlBody,
        });
        results.push({ to: email, success: true });
      } catch (err: any) {
        results.push({
          to: email,
          success: false,
          error: String(err?.message || err),
        });
      }
    }
    return results;
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async cleanupExpiredOtps() {
    const expiredOtps = await this.otpModel.findAll({
      where: {
        expiresAt: { [Op.lt]: new Date() },
        verified: false,
      },
    });

    for (const otp of expiredOtps) {
      if (otp.customerAccountId) {
        await this.deleteRegistration(otp.customerAccountId);
      }
      await otp.destroy();
    }
  }

  private async deleteRegistration(customerAccountId: number) {
    const account = await this.customerAccountModel.findByPk(customerAccountId);
    if (account) {
      const customerId = account.customerId;
      await account.destroy();
      if (customerId) {
        await this.customerModel.destroy({ where: { id: customerId } });
      }
    }
  }

  async sendOtp(dto: SendOtpDto) {
    const email = dto.email.toLowerCase().trim();

    // Clean up expired OTPs first
    await this.cleanupExpiredOtps();

    // Check if there's an existing unverified OTP for this email
    const existingOtp = await this.otpModel.findOne({
      where: {
        email,
        verified: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    // Find associated customer account if exists
    const customerAccount = await this.customerAccountModel.findOne({
      where: { email },
    });

    const otpCode = this.generateOtpCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    if (existingOtp) {
      // Update existing OTP
      await existingOtp.update({
        code: otpCode,
        expiresAt,
        attempts: 0,
      });
    } else {
      // Create new OTP
      await this.otpModel.create({
        email,
        code: otpCode,
        expiresAt,
        attempts: 0,
        verified: false,
        customerAccountId: customerAccount?.id || null,
      });
    }

    // Send OTP email
    const transporter = this.buildTransporter();
    const fromAddress = this.getFromAddress();

    try {
      await Promise.race([
        transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: 'Your OTP Verification Code',
          text: `Your OTP verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>OTP Verification Code</h2>
              <p>Your OTP verification code is:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${otpCode}
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('SMTP connection timeout after 15 seconds')),
            15000,
          ),
        ),
      ]);
    } catch (err: any) {
      // Clean up the OTP record if email sending fails
      const otpRecord = await this.otpModel.findOne({
        where: { email, code: otpCode },
      });
      if (otpRecord) {
        await otpRecord.destroy();
      }

      const errorMessage =
        err?.message || err?.code || 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to send OTP email: ${errorMessage}. Please check your SMTP configuration and network connectivity.`,
      );
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      email,
      expiresIn: 600, // 10 minutes in seconds
    };
  }

  async checkOtp(dto: CheckOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const otpCode = dto.otp.trim();

    // Clean up expired OTPs first
    await this.cleanupExpiredOtps();

    const otp = await this.otpModel.findOne({
      where: {
        email,
        verified: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otp) {
      throw new NotFoundException(
        'OTP not found or expired. Please request a new OTP.',
      );
    }

    // Check if OTP is correct
    if (otp.code !== otpCode) {
      const newAttempts = otp.attempts + 1;

      if (newAttempts >= 5) {
        // Delete registration if 5 failed attempts
        if (otp.customerAccountId) {
          await this.deleteRegistration(otp.customerAccountId);
        }
        await otp.destroy();
        throw new BadRequestException(
          'Maximum attempts exceeded. Registration has been deleted. Please register again.',
        );
      }

      await otp.update({ attempts: newAttempts });
      throw new BadRequestException(
        `Invalid OTP. ${5 - newAttempts} attempts remaining.`,
      );
    }

    // OTP is correct - mark as verified
    await otp.update({ verified: true });

    return {
      success: true,
      message: 'OTP verified successfully',
      email,
    };
  }
}
