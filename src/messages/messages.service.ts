import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { SendMailDto } from './dto/send-mail.dto';
import * as nodemailer from 'nodemailer';
import { marked } from 'marked';
import { CustomerModel } from '../customers/customer.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
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
    });
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
}
