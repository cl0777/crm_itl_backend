import { MessageModel } from './message.model';
import { OtpModel } from './otp.model';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { CustomerModel } from '../customers/customer.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
export declare class MessagesService {
    private readonly messageModel;
    private readonly otpModel;
    private readonly customerAccountModel;
    private readonly customerModel;
    constructor(messageModel: typeof MessageModel, otpModel: typeof OtpModel, customerAccountModel: typeof CustomerAccountModel, customerModel: typeof CustomerModel);
    private buildTransporter;
    private getFromAddress;
    history(userId?: number): Promise<MessageModel[]>;
    sendMail(dto: SendMailDto, attachments: Array<Express.Multer.File>, senderUserId: number): Promise<{
        count: number;
        results: any[];
    }>;
    sendNotificationEmail(toEmails: string[], subject: string, htmlBody: string, textBody?: string): Promise<any[]>;
    private generateOtpCode;
    private cleanupExpiredOtps;
    private deleteRegistration;
    sendOtp(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
        email: string;
        expiresIn: number;
    }>;
    checkOtp(dto: CheckOtpDto): Promise<{
        success: boolean;
        message: string;
        email: string;
    }>;
}
