"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const customers_controller_1 = require("./customers.controller");
const customers_auth_controller_1 = require("./customers.auth.controller");
const customers_service_1 = require("./customers.service");
const customer_model_1 = require("./customer.model");
const customer_account_model_1 = require("./customer-account.model");
const users_module_1 = require("../users/users.module");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([customer_model_1.CustomerModel, customer_account_model_1.CustomerAccountModel]),
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
                signOptions: { expiresIn: '30d' },
            }),
        ],
        controllers: [customers_controller_1.CustomersController, customers_auth_controller_1.CustomersAuthController],
        providers: [customers_service_1.CustomersService],
        exports: [customers_service_1.CustomersService],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map