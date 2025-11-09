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
const message_model_1 = require("./message.model");
const customer_model_1 = require("../customers/customer.model");
const customers_module_1 = require("../customers/customers.module");
const users_module_1 = require("../users/users.module");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([message_model_1.MessageModel, customer_model_1.CustomerModel]),
            customers_module_1.CustomersModule,
            users_module_1.UsersModule,
        ],
        controllers: [messages_controller_1.MessagesController],
        providers: [messages_service_1.MessagesService],
        exports: [messages_service_1.MessagesService],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map