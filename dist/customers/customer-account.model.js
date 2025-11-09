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
exports.CustomerAccountModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const customer_model_1 = require("./customer.model");
let CustomerAccountModel = class CustomerAccountModel extends sequelize_typescript_1.Model {
};
exports.CustomerAccountModel = CustomerAccountModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], CustomerAccountModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => customer_model_1.CustomerModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true }),
    __metadata("design:type", Object)
], CustomerAccountModel.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => customer_model_1.CustomerModel),
    __metadata("design:type", customer_model_1.CustomerModel)
], CustomerAccountModel.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CustomerAccountModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CustomerAccountModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], CustomerAccountModel.prototype, "passwordHash", void 0);
exports.CustomerAccountModel = CustomerAccountModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'customer_accounts', timestamps: true })
], CustomerAccountModel);
//# sourceMappingURL=customer-account.model.js.map