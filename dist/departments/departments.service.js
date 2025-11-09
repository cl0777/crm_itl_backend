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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const department_model_1 = require("./department.model");
const user_model_1 = require("../users/user.model");
let DepartmentsService = class DepartmentsService {
    constructor(departmentModel, userModel) {
        this.departmentModel = departmentModel;
        this.userModel = userModel;
    }
    async findAll(userRole, userDepartmentId) {
        if (userRole === 'admin') {
            return this.departmentModel.findAll();
        }
        else if (userRole === 'manager' && userDepartmentId) {
            return this.departmentModel.findAll({
                where: { id: userDepartmentId },
            });
        }
        else {
            return [];
        }
    }
    async findOne(id) {
        const department = await this.departmentModel.findByPk(id);
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        return department;
    }
    async create(name, description, managerId) {
        const department = await this.departmentModel.create({
            name,
            description,
            managerId,
        });
        if (managerId) {
            const manager = await this.userModel.findByPk(managerId);
            if (manager) {
                manager.departmentId = department.id;
                await manager.save();
            }
        }
        return department;
    }
    async update(id, dto) {
        const department = await this.departmentModel.findByPk(id);
        if (!department) {
            throw new common_1.NotFoundException('Department not found');
        }
        if (dto.name)
            department.name = dto.name;
        if (dto.description !== undefined)
            department.description = dto.description;
        if (dto.managerId !== undefined)
            department.managerId = dto.managerId;
        await department.save();
        if (dto.managerId !== undefined) {
            const manager = await this.userModel.findByPk(dto.managerId);
            if (manager) {
                manager.departmentId = department.id;
                await manager.save();
            }
        }
        return department;
    }
    async remove(id) {
        const deleted = await this.departmentModel.destroy({ where: { id } });
        if (deleted === 0) {
            throw new common_1.NotFoundException('Department not found');
        }
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(department_model_1.DepartmentModel)),
    __param(1, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, Object])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map