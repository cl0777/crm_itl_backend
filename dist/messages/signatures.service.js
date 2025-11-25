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
exports.SignaturesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const signature_model_1 = require("./signature.model");
const marked_1 = require("marked");
const sequelize_2 = require("sequelize");
let SignaturesService = class SignaturesService {
    constructor(signatureModel) {
        this.signatureModel = signatureModel;
    }
    async create(dto, userId) {
        const contentHtml = (await marked_1.marked.parse(dto.content || ''));
        if (dto.isDefault) {
            await this.signatureModel.update({ isDefault: false }, { where: { userId, isDefault: true } });
        }
        const signature = await this.signatureModel.create({
            ...dto,
            contentHtml,
            userId,
            isDefault: dto.isDefault ?? false,
        });
        return signature.get({ plain: true });
    }
    async findAll(userId) {
        const signatures = await this.signatureModel.findAll({
            where: { userId },
            order: [
                ['isDefault', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
        return signatures.map((s) => s.get({ plain: true }));
    }
    async findOne(id, userId) {
        const signature = await this.signatureModel.findOne({
            where: { id, userId },
        });
        if (!signature) {
            throw new common_1.NotFoundException('Signature not found');
        }
        return signature.get({ plain: true });
    }
    async update(id, dto, userId) {
        const signature = await this.signatureModel.findOne({
            where: { id, userId },
        });
        if (!signature) {
            throw new common_1.NotFoundException('Signature not found');
        }
        if (dto.isDefault === true) {
            await this.signatureModel.update({ isDefault: false }, {
                where: {
                    userId,
                    isDefault: true,
                    id: { [sequelize_2.Op.ne]: id },
                },
            });
        }
        const updateData = { ...dto };
        if (dto.content !== undefined) {
            updateData.contentHtml = (await marked_1.marked.parse(dto.content));
        }
        await signature.update(updateData);
        return signature.get({ plain: true });
    }
    async remove(id, userId) {
        const signature = await this.signatureModel.findOne({
            where: { id, userId },
        });
        if (!signature) {
            throw new common_1.NotFoundException('Signature not found');
        }
        await signature.destroy();
        return { success: true };
    }
    async getDefault(userId) {
        const signature = await this.signatureModel.findOne({
            where: { userId, isDefault: true },
        });
        return signature ? signature.get({ plain: true }) : null;
    }
};
exports.SignaturesService = SignaturesService;
exports.SignaturesService = SignaturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(signature_model_1.SignatureModel)),
    __metadata("design:paramtypes", [Object])
], SignaturesService);
//# sourceMappingURL=signatures.service.js.map