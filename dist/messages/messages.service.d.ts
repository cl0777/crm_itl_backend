import { MessageModel } from './message.model';
import { SendMailDto } from './dto/send-mail.dto';
export declare class MessagesService {
    private readonly messageModel;
    constructor(messageModel: typeof MessageModel);
    private buildTransporter;
    private getFromAddress;
    history(userId?: number): Promise<MessageModel[]>;
    sendMail(dto: SendMailDto, attachments: Array<Express.Multer.File>, senderUserId: number): Promise<{
        count: number;
        results: any[];
    }>;
    sendNotificationEmail(toEmails: string[], subject: string, htmlBody: string, textBody?: string): Promise<any[]>;
}
