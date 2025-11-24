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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const users_service_1 = require("../users/users.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const import_customers_dto_1 = require("./dto/import-customers.dto");
let CustomersController = class CustomersController {
    constructor(customersService, usersService) {
        this.customersService = customersService;
        this.usersService = usersService;
    }
    async create(dto, req) {
        const user = await this.usersService.findEntityById(req.user.userId);
        const addedByName = user?.name || 'Unknown';
        return this.customersService.create(dto, req.user.userId, addedByName);
    }
    async findAll(req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        const userDepartmentId = req.user?.departmentId;
        return this.customersService.findAll(userId, userRole, userDepartmentId);
    }
    async getCount(req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        const userDepartmentId = req.user?.departmentId;
        const count = await this.customersService.getCount(userId, userRole, userDepartmentId);
        return { count };
    }
    async findOne(id, req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        return this.customersService.findOne(Number(id), userId, userRole);
    }
    async update(id, dto, req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        return this.customersService.update(Number(id), dto, userId, userRole);
    }
    async remove(id, req) {
        const userRole = req.user?.role;
        const userId = userRole === 'admin' ? undefined : req.user?.userId;
        await this.customersService.remove(Number(id), userId, userRole);
        return { success: true };
    }
    async import(file, req) {
        console.log('=== CUSTOMER IMPORT REQUEST ===');
        console.log('File:', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size,
            bufferLength: file?.buffer?.length,
        });
        console.log('User ID:', req.user?.userId);
        console.log('User Role:', req.user?.role);
        const user = await this.usersService.findEntityById(req.user.userId);
        const addedByName = user?.name || 'Unknown';
        console.log('Added By:', addedByName);
        const result = await this.customersService.importFromXlsx(file?.buffer || Buffer.alloc(0), req.user.userId, addedByName);
        console.log('Import Result:', {
            count: result.count,
            itemsCount: result.items?.length,
        });
        console.log('=== END CUSTOMER IMPORT ===');
        return result;
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Create customer' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'List all customers' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get total count of customers' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get customer by id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Update customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOkResponse)({ description: 'Import customers from XLSX' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: import_customers_dto_1.ImportCustomersDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (_req, file, cb) => {
            const allowed = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (allowed.includes(file.mimetype))
                return cb(null, true);
            return cb(null, false);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "import", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)({ path: 'customers', version: '1' }),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        users_service_1.UsersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map