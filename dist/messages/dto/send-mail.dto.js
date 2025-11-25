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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SendMailDto {
}
exports.SendMailDto = SendMailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quarterly Update' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Markdown content of the email',
        example: '# Hello\nThis is an update.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMailDto.prototype, "bodyMarkdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target customers by ID (comma-separated or array)',
        example: '1,2,3',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map((id) => parseInt(id.trim(), 10));
        }
        if (Array.isArray(value)) {
            return value.map((id) => typeof id === 'number' ? id : parseInt(id, 10));
        }
        return [parseInt(value, 10)];
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    __metadata("design:type", Array)
], SendMailDto.prototype, "customerIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional signature ID to append to the email',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendMailDto.prototype, "signatureId", void 0);
//# sourceMappingURL=send-mail.dto.js.map