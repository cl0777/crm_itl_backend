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
const nodemailer = require("nodemailer");
const marked_1 = require("marked");
const customer_model_1 = require("../customers/customer.model");
let MessagesService = class MessagesService {
    constructor(messageModel) {
        this.messageModel = messageModel;
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
        });
    }
    getFromAddress() {
        const from = process.env.SMTP_FROM || process.env.SMTP_USER;
        if (!from) {
            throw new common_1.InternalServerErrorException('SMTP_FROM or SMTP_USER must be configured.');
        }
        return from;
    }
    async history(userId) {
        const where = userId ? { userId } : {};
        return this.messageModel.findAll({ where, order: [['createdAt', 'DESC']] });
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(message_model_1.MessageModel)),
    __metadata("design:paramtypes", [Object])
], MessagesService);
//# sourceMappingURL=messages.service.js.map