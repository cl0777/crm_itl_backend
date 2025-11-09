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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const customers_module_1 = require("./customers/customers.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const users_service_1 = require("./users/users.service");
const messages_module_1 = require("./messages/messages.module");
const departments_module_1 = require("./departments/departments.module");
const orders_module_1 = require("./orders/orders.module");
let AppModule = class AppModule {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onModuleInit() {
        try {
            const existing = await this.usersService.findByUsername('admin_crm');
            if (!existing) {
                await this.usersService.createUser('clayoffical7@gmail.com', 'admin_crm', 'admin_itl_crm', 'Admin', 'admin');
                console.log('Default admin user created: admin_crm');
            }
        }
        catch (e) {
            console.error('Failed to ensure default admin user:', e);
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 5432),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASS || 'root',
                database: process.env.DB_NAME || 'crm_itl',
                autoLoadModels: true,
                synchronize: true,
                sync: { alter: true },
                logging: false,
            }),
            customers_module_1.CustomersModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule,
            departments_module_1.DepartmentsModule,
            orders_module_1.OrdersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AppModule);
//# sourceMappingURL=app.module.js.map