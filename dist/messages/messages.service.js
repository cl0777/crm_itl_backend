"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const message_model_1 = require("./message.model");
const otp_model_1 = require("./otp.model");
const nodemailer = require("nodemailer");
const marked_1 = require("marked");
const customer_model_1 = require("../customers/customer.model");
const customer_account_model_1 = require("../customers/customer-account.model");
const user_model_1 = require("../users/user.model");
const sequelize_2 = require("sequelize");
let MessagesService = class MessagesService {
    constructor(messageModel, otpModel, customerAccountModel, customerModel, userModel) {
        this.messageModel = messageModel;
        this.otpModel = otpModel;
        this.customerAccountModel = customerAccountModel;
        this.customerModel = customerModel;
        this.userModel = userModel;
    }
    buildTransporter() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT || '0');
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const secureEnv = process.env.SMTP_SECURE;
        if (!host || !port || !user || !pass) {
            throw new common_1.InternalServerErrorException('SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
        }
        const secure = secureEnv !== undefined
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
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });
    }
    getFromAddress() {
        const from = process.env.SMTP_FROM || process.env.SMTP_USER;
        if (!from) {
            throw new common_1.InternalServerErrorException('SMTP_FROM or SMTP_USER must be configured.');
        }
        return from;
    }
    async addRecipientInfo(messages) {
        if (messages.length === 0) {
            return messages;
        }
        const recipientEmails = [
            ...new Set(messages.map((m) => m.toEmail.toLowerCase().trim())),
        ];
        const customers = await this.customerModel.findAll({
            where: {
                email: {
                    [sequelize_2.Op.in]: recipientEmails,
                },
            },
            attributes: [
                'id',
                'partyName',
                'shortname',
                'email',
                'phone1',
                'city',
                'country',
            ],
        });
        const customerMap = new Map(customers.map((c) => [c.email.toLowerCase().trim(), c]));
        return messages.map((message) => {
            const messageData = message.get({ plain: true });
            const recipientEmail = message.toEmail.toLowerCase().trim();
            const recipient = customerMap.get(recipientEmail);
            return {
                ...messageData,
                recipient: recipient
                    ? {
                        id: recipient.id,
                        partyName: recipient.partyName,
                        shortname: recipient.shortname,
                        email: recipient.email,
                        phone1: recipient.phone1,
                        city: recipient.city,
                        country: recipient.country,
                    }
                    : {
                        email: message.toEmail,
                        partyName: null,
                        shortname: null,
                    },
            };
        });
    }
    async history(role, userId) {
        let messages;
        if (role === 'admin') {
            messages = await this.messageModel.findAll({
                include: [
                    {
                        model: user_model_1.UserModel,
                        as: 'user',
                        attributes: ['id', 'username', 'name', 'role', 'departmentId'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        else if (role === 'manager') {
            const manager = await this.userModel.findByPk(userId, {
                attributes: ['id', 'departmentId'],
            });
            if (!manager || !manager.departmentId) {
                return [];
            }
            const departmentUsers = await this.userModel.findAll({
                where: { departmentId: manager.departmentId },
                attributes: ['id'],
            });
            const departmentUserIds = departmentUsers.map((u) => u.id);
            messages = await this.messageModel.findAll({
                where: {
                    userId: {
                        [sequelize_2.Op.in]: departmentUserIds,
                    },
                },
                include: [
                    {
                        model: user_model_1.UserModel,
                        as: 'user',
                        attributes: ['id', 'username', 'name', 'role', 'departmentId'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        else {
            messages = await this.messageModel.findAll({
                where: { userId },
                include: [
                    {
                        model: user_model_1.UserModel,
                        as: 'user',
                        attributes: ['id', 'username', 'name', 'role', 'departmentId'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        return this.addRecipientInfo(messages);
    }
    async sendMail(dto, attachments, senderUserId) {
        console.log('sendMail', dto, attachments, senderUserId);
        const transporter = this.buildTransporter();
        const fromAddress = this.getFromAddress();
        const customers = await customer_model_1.CustomerModel.findAll({
            where: { id: dto.customerIds },
            attributes: ['id', 'email', 'partyName'],
        });
        const seen = new Set();
        const recipients = customers
            .map((c) => ({ email: String(c.email || '').trim(), name: c.partyName }))
            .filter((c) => c.email)
            .filter((c) => {
            const key = c.email.toLowerCase();
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
        const html = (await marked_1.marked.parse(dto.bodyMarkdown || ''));
        const text = (dto.bodyMarkdown || '').replace(/[#*_>`]/g, '');
        const nodemailerAttachments = (attachments || []).map((f) => ({
            filename: f.originalname,
            content: f.buffer,
            contentType: f.mimetype,
        }));
        const results = [];
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
                    attachmentsJson: JSON.stringify(nodemailerAttachments.map((a) => a.filename)),
                    status: 'sent',
                    userId: senderUserId,
                    sentAt: new Date(),
                });
                results.push({ to: r.email, messageId: info.messageId, id: saved.id });
            }
            catch (err) {
                await this.messageModel.create({
                    subject: dto.subject,
                    bodyMarkdown: dto.bodyMarkdown,
                    bodyHtml: html,
                    fromEmail: String(fromAddress || ''),
                    toEmail: r.email,
                    attachmentsJson: JSON.stringify(nodemailerAttachments.map((a) => a.filename)),
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
    async sendNotificationEmail(toEmails, subject, htmlBody, textBody) {
        const transporter = this.buildTransporter();
        const fromAddress = this.getFromAddress();
        const results = [];
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
            }
            catch (err) {
                results.push({
                    to: email,
                    success: false,
                    error: String(err?.message || err),
                });
            }
        }
        return results;
    }
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async cleanupExpiredOtps() {
        const expiredOtps = await this.otpModel.findAll({
            where: {
                expiresAt: { [sequelize_2.Op.lt]: new Date() },
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
    async deleteRegistration(customerAccountId) {
        const account = await this.customerAccountModel.findByPk(customerAccountId);
        if (account) {
            const customerId = account.customerId;
            await account.destroy();
            if (customerId) {
                await this.customerModel.destroy({ where: { id: customerId } });
            }
        }
    }
    async sendOtp(dto) {
        const email = dto.email.toLowerCase().trim();
        await this.cleanupExpiredOtps();
        const existingOtp = await this.otpModel.findOne({
            where: {
                email,
                verified: false,
                expiresAt: { [sequelize_2.Op.gt]: new Date() },
            },
            order: [['createdAt', 'DESC']],
        });
        const customerAccount = await this.customerAccountModel.findOne({
            where: { email },
        });
        const otpCode = this.generateOtpCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        if (existingOtp) {
            await existingOtp.update({
                code: otpCode,
                expiresAt,
                attempts: 0,
            });
        }
        else {
            await this.otpModel.create({
                email,
                code: otpCode,
                expiresAt,
                attempts: 0,
                verified: false,
                customerAccountId: customerAccount?.id || null,
            });
        }
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
          <center>
            <img src="https://htl-tm.com//logo.png" alt="Halkara Turkmen Logistik" style="width: 150px; height: 100px;">
          </center>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>OTP Verification Code</h2>
              <p>Your OTP verification code is:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${otpCode}
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
              <p style="color: #666; font-size: 12px;">If you have any questions, please contact us at ${fromAddress} | Contact: +993 71 713777</p>
              <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
              <p style="color: #666; font-size: 12px;">Best regards,</p>
              <p style="color: #666; font-size: 12px;">Halkara Turkmen Logistik</p>
            </div>
          `,
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP connection timeout after 15 seconds')), 15000)),
            ]);
        }
        catch (err) {
            const otpRecord = await this.otpModel.findOne({
                where: { email, code: otpCode },
            });
            if (otpRecord) {
                await otpRecord.destroy();
            }
            const errorMessage = err?.message || err?.code || 'Unknown error occurred';
            throw new common_1.InternalServerErrorException(`Failed to send OTP email: ${errorMessage}. Please check your SMTP configuration and network connectivity.`);
        }
        return {
            success: true,
            message: 'OTP sent successfully',
            email,
            expiresIn: 600,
        };
    }
    async checkOtp(dto) {
        const email = dto.email.toLowerCase().trim();
        const otpCode = dto.otp.trim();
        await this.cleanupExpiredOtps();
        const otp = await this.otpModel.findOne({
            where: {
                email,
                verified: false,
                expiresAt: { [sequelize_2.Op.gt]: new Date() },
            },
            order: [['createdAt', 'DESC']],
        });
        if (!otp) {
            throw new common_1.NotFoundException('OTP not found or expired. Please request a new OTP.');
        }
        if (otp.code !== otpCode) {
            const newAttempts = otp.attempts + 1;
            if (newAttempts >= 5) {
                if (otp.customerAccountId) {
                    await this.deleteRegistration(otp.customerAccountId);
                }
                await otp.destroy();
                throw new common_1.BadRequestException('Maximum attempts exceeded. Registration has been deleted. Please register again.');
            }
            await otp.update({ attempts: newAttempts });
            throw new common_1.BadRequestException(`Invalid OTP. ${5 - newAttempts} attempts remaining.`);
        }
        await otp.update({ verified: true });
        return {
            success: true,
            message: 'OTP verified successfully',
            email,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(message_model_1.MessageModel)),
    __param(1, (0, sequelize_1.InjectModel)(otp_model_1.OtpModel)),
    __param(2, (0, sequelize_1.InjectModel)(customer_account_model_1.CustomerAccountModel)),
    __param(3, (0, sequelize_1.InjectModel)(customer_model_1.CustomerModel)),
    __param(4, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], MessagesService);
//# sourceMappingURL=messages.service.js.map