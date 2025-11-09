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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const messages_service_1 = require("./messages.service");
const send_mail_dto_1 = require("./dto/send-mail.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async history(req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        return this.messagesService.history(userId);
    }
    async sendMail(dto, attachments, req) {
        console.log('=== SEND MAIL REQUEST ===');
        console.log('DTO:', JSON.stringify(dto, null, 2));
        console.log('Attachments:', attachments?.length || 0);
        console.log('User ID:', req.user?.userId);
        return this.messagesService.sendMail(dto, attachments || [], req.user.userId);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get message history' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "history", null);
__decorate([
    (0, common_1.Post)('mail'),
    (0, swagger_1.ApiOkResponse)({ description: 'Send emails to customers' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Attachments under key `attachments`',
        type: send_mail_dto_1.SendMailDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('attachments', 20, {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_mail_dto_1.SendMailDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMail", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('messages'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'messages', version: '1' }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map