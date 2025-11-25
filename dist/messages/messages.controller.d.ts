import { MessagesService } from './messages.service';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    history(req: any): Promise<any[]>;
    sendMail(dto: SendMailDto, attachments: Array<Express.Multer.File>, req: any): Promise<{
        count: number;
        results: any[];
    }>;
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
