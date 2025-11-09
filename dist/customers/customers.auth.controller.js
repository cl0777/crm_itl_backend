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
exports.CustomersAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const customer_register_dto_1 = require("./dto/customer-register.dto");
const customer_login_dto_1 = require("./dto/customer-login.dto");
let CustomersAuthController = class CustomersAuthController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async register(dto) {
        return this.customersService.registerCustomer(dto);
    }
    async login(dto) {
        return this.customersService.loginCustomer(dto);
    }
};
exports.CustomersAuthController = CustomersAuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOkResponse)({ description: 'Register a new customer account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_register_dto_1.CustomerRegisterDto]),
    __metadata("design:returntype", Promise)
], CustomersAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({ description: 'Login a customer and get tokens' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_login_dto_1.CustomerLoginDto]),
    __metadata("design:returntype", Promise)
], CustomersAuthController.prototype, "login", null);
exports.CustomersAuthController = CustomersAuthController = __decorate([
    (0, swagger_1.ApiTags)('customers-auth'),
    (0, common_1.Controller)({ path: 'customers/auth', version: '1' }),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersAuthController);
//# sourceMappingURL=customers.auth.controller.js.map