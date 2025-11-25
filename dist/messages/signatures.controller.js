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
exports.SignaturesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const signatures_service_1 = require("./signatures.service");
const create_signature_dto_1 = require("./dto/create-signature.dto");
const update_signature_dto_1 = require("./dto/update-signature.dto");
let SignaturesController = class SignaturesController {
    constructor(signaturesService) {
        this.signaturesService = signaturesService;
    }
    async create(dto, req) {
        return this.signaturesService.create(dto, req.user.userId);
    }
    async findAll(req) {
        return this.signaturesService.findAll(req.user.userId);
    }
    async getDefault(req) {
        return this.signaturesService.getDefault(req.user.userId);
    }
    async findOne(id, req) {
        return this.signaturesService.findOne(Number(id), req.user.userId);
    }
    async update(id, dto, req) {
        return this.signaturesService.update(Number(id), dto, req.user.userId);
    }
    async remove(id, req) {
        await this.signaturesService.remove(Number(id), req.user.userId);
        return { success: true };
    }
};
exports.SignaturesController = SignaturesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Create a new email signature' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_signature_dto_1.CreateSignatureDto, Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all signatures for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('default'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get the default signature for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "getDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get a signature by id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Update a signature' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_signature_dto_1.UpdateSignatureDto, Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete a signature' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SignaturesController.prototype, "remove", null);
exports.SignaturesController = SignaturesController = __decorate([
    (0, swagger_1.ApiTags)('signatures'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'signatures', version: '1' }),
    __metadata("design:paramtypes", [signatures_service_1.SignaturesService])
], SignaturesController);
//# sourceMappingURL=signatures.controller.js.map