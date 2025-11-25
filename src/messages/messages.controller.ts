import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('messages')
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('history')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Get message history' })
  async history(@Req() req: any) {
    const userRole = req.user?.role || 'user';
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    return this.messagesService.history(userRole, userId);
  }

  @Post('mail')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Send emails to customers' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Attachments under key `attachments`',
    type: SendMailDto,
  })
  @UseInterceptors(
    FilesInterceptor('attachments', 20, {
      storage: memoryStorage(),
    }),
  )
  async sendMail(
    @Body() dto: SendMailDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>,
    @Req() req: any,
  ) {
    console.log('=== SEND MAIL REQUEST ===');
    console.log('DTO:', JSON.stringify(dto, null, 2));
    console.log('Attachments:', attachments?.length || 0);
    console.log('User ID:', req.user?.userId);
    return this.messagesService.sendMail(
      dto,
      attachments || [],
      req.user.userId,
    );
  }

  @Post('otp/send')
  @ApiOkResponse({ description: 'Send OTP to email' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.messagesService.sendOtp(dto);
  }

  @Post('otp/check')
  @ApiOkResponse({ description: 'Verify OTP code' })
  async checkOtp(@Body() dto: CheckOtpDto) {
    return this.messagesService.checkOtp(dto);
  }
}
