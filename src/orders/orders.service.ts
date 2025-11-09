import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderModel } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
import { CustomerModel } from '../customers/customer.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderModel)
    private readonly orderModel: typeof OrderModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly messagesService: MessagesService,
  ) {}

  async createForCustomer(customerAccountId: number, dto: CreateOrderDto) {
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
          model: CustomerAccountModel,
          include: [CustomerModel],
        },
      ],
    });
    const orderData =
      orderDataEntity?.get({ plain: true }) || order.get({ plain: true });

    // Send email notification to admins
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
            ${
              dto.lengthCm || dto.widthCm || dto.heightCm
                ? `<li><strong>Dimensions:</strong> ${dto.lengthCm || 'N/A'} x ${dto.widthCm || 'N/A'} x ${dto.heightCm || 'N/A'} cm</li>`
                : ''
            }
            ${dto.declaredValueUsd ? `<li><strong>Declared Value:</strong> $${dto.declaredValueUsd}</li>` : ''}
            ${dto.timeline ? `<li><strong>Timeline:</strong> ${dto.timeline}</li>` : ''}
            ${dto.totalAmount ? `<li><strong>Total Amount:</strong> $${dto.totalAmount}</li>` : ''}
          </ul>
          ${dto.description ? `<p><strong>Description:</strong> ${dto.description}</p>` : ''}
        `;

        await this.messagesService.sendNotificationEmail(
          adminEmails,
          `New Order #${orderData.id} - ${dto.originCity} to ${dto.destinationCity}`,
          htmlBody,
        );
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send admin notification email:', error);
    }

    return orderData;
  }

  async listForCustomer(customerAccountId: number) {
    return this.orderModel.findAll({
      where: { customerAccountId },
      include: [
        {
          model: CustomerAccountModel,
          include: [CustomerModel],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
