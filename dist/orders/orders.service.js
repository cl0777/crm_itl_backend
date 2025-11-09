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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const order_model_1 = require("./order.model");
const messages_service_1 = require("../messages/messages.service");
const user_model_1 = require("../users/user.model");
const customer_account_model_1 = require("../customers/customer-account.model");
const customer_model_1 = require("../customers/customer.model");
let OrdersService = class OrdersService {
    constructor(orderModel, userModel, messagesService) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.messagesService = messagesService;
    }
    async createForCustomer(customerAccountId, dto) {
        const order = await this.orderModel.create({
            customerAccountId,
            description: dto.description,
            totalAmount: dto.totalAmount,
            originCity: dto.originCity,
            originCountry: dto.originCountry,
            destinationCity: dto.destinationCity,
            destinationCountry: dto.destinationCountry,
            weightKg: dto.weightKg,
            shipmentType: dto.shipmentType,
            lengthCm: dto.lengthCm,
            widthCm: dto.widthCm,
            heightCm: dto.heightCm,
            declaredValueUsd: dto.declaredValueUsd,
            timeline: dto.timeline,
        });
        const orderDataEntity = await this.orderModel.findByPk(order.id, {
            include: [
                {
                    model: customer_account_model_1.CustomerAccountModel,
                    include: [customer_model_1.CustomerModel],
                },
            ],
        });
        const orderData = orderDataEntity?.get({ plain: true }) || order.get({ plain: true });
        try {
            const adminUsers = await this.userModel.findAll({
                where: { role: 'admin' },
                attributes: ['email'],
            });
            const adminEmails = adminUsers
                .map((u) => u.email)
                .filter((email) => email && email.trim());
            if (adminEmails.length > 0) {
                const htmlBody = `
          <h2>New Order Created</h2>
          <p><strong>Order ID:</strong> #${orderData.id}</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
          <h3>Shipment Details:</h3>
          <ul>
            <li><strong>Origin:</strong> ${dto.originCity}, ${dto.originCountry}</li>
            <li><strong>Destination:</strong> ${dto.destinationCity}, ${dto.destinationCountry}</li>
            <li><strong>Weight:</strong> ${dto.weightKg} kg</li>
            <li><strong>Shipment Type:</strong> ${dto.shipmentType}</li>
            ${dto.lengthCm || dto.widthCm || dto.heightCm
                    ? `<li><strong>Dimensions:</strong> ${dto.lengthCm || 'N/A'} x ${dto.widthCm || 'N/A'} x ${dto.heightCm || 'N/A'} cm</li>`
                    : ''}
            ${dto.declaredValueUsd ? `<li><strong>Declared Value:</strong> $${dto.declaredValueUsd}</li>` : ''}
            ${dto.timeline ? `<li><strong>Timeline:</strong> ${dto.timeline}</li>` : ''}
            ${dto.totalAmount ? `<li><strong>Total Amount:</strong> $${dto.totalAmount}</li>` : ''}
          </ul>
          ${dto.description ? `<p><strong>Description:</strong> ${dto.description}</p>` : ''}
        `;
                await this.messagesService.sendNotificationEmail(adminEmails, `New Order #${orderData.id} - ${dto.originCity} to ${dto.destinationCity}`, htmlBody);
            }
        }
        catch (error) {
            console.error('Failed to send admin notification email:', error);
        }
        return orderData;
    }
    async listForCustomer(customerAccountId) {
        return this.orderModel.findAll({
            where: { customerAccountId },
            include: [
                {
                    model: customer_account_model_1.CustomerAccountModel,
                    include: [customer_model_1.CustomerModel],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(order_model_1.OrderModel)),
    __param(1, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, Object, messages_service_1.MessagesService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map