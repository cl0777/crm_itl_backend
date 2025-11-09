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
exports.OrderModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const customer_account_model_1 = require("../customers/customer-account.model");
let OrderModel = class OrderModel extends sequelize_typescript_1.Model {
};
exports.OrderModel = OrderModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], OrderModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_account_model_1.CustomerAccountModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], OrderModel.prototype, "customerAccountId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_account_model_1.CustomerAccountModel),
    __metadata("design:type", customer_account_model_1.CustomerAccountModel)
], OrderModel.prototype, "customerAccount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], OrderModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('pending', 'confirmed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending',
    }),
    __metadata("design:type", String)
], OrderModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "totalAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OrderModel.prototype, "originCity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OrderModel.prototype, "originCountry", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OrderModel.prototype, "destinationCity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OrderModel.prototype, "destinationCountry", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 3), allowNull: false }),
    __metadata("design:type", Number)
], OrderModel.prototype, "weightKg", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], OrderModel.prototype, "shipmentType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "lengthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "widthCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "heightCm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "declaredValueUsd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], OrderModel.prototype, "timeline", void 0);
exports.OrderModel = OrderModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'orders', timestamps: true })
], OrderModel);
//# sourceMappingURL=order.model.js.map