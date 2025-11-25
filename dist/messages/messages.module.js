"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const messages_controller_1 = require("./messages.controller");
const messages_service_1 = require("./messages.service");
const signatures_controller_1 = require("./signatures.controller");
const signatures_service_1 = require("./signatures.service");
const message_model_1 = require("./message.model");
const otp_model_1 = require("./otp.model");
const signature_model_1 = require("./signature.model");
const customer_model_1 = require("../customers/customer.model");
const customer_account_model_1 = require("../customers/customer-account.model");
const user_model_1 = require("../users/user.model");
const customers_module_1 = require("../customers/customers.module");
const users_module_1 = require("../users/users.module");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                message_model_1.MessageModel,
                otp_model_1.OtpModel,
                signature_model_1.SignatureModel,
                customer_model_1.CustomerModel,
                customer_account_model_1.CustomerAccountModel,
                user_model_1.UserModel,
            ]),
            customers_module_1.CustomersModule,
            users_module_1.UsersModule,
        ],
        controllers: [messages_controller_1.MessagesController, signatures_controller_1.SignaturesController],
        providers: [messages_service_1.MessagesService, signatures_service_1.SignaturesService],
        exports: [messages_service_1.MessagesService, signatures_service_1.SignaturesService],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map