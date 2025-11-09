import { MessagesService } from './messages.service';
import { SendMailDto } from './dto/send-mail.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    history(req: any): Promise<import("./message.model").MessageModel[]>;
    sendMail(dto: SendMailDto, attachments: Array<Express.Multer.File>, req: any): Promise<{
        count: number;
        results: any[];
    }>;
}
