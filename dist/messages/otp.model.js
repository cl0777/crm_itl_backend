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
exports.OtpModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const customer_account_model_1 = require("../customers/customer-account.model");
let OtpModel = class OtpModel extends sequelize_typescript_1.Model {
};
exports.OtpModel = OtpModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], OtpModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OtpModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OtpModel.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], OtpModel.prototype, "attempts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], OtpModel.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false }),
    __metadata("design:type", Boolean)
], OtpModel.prototype, "verified", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_account_model_1.CustomerAccountModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], OtpModel.prototype, "customerAccountId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_account_model_1.CustomerAccountModel),
    __metadata("design:type", customer_account_model_1.CustomerAccountModel)
], OtpModel.prototype, "customerAccount", void 0);
exports.OtpModel = OtpModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'otps', timestamps: true })
], OtpModel);
//# sourceMappingURL=otp.model.js.map