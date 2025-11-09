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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("./user.model");
const department_model_1 = require("../departments/department.model");
let UsersService = class UsersService {
    constructor(userModel, departmentModel) {
        this.userModel = userModel;
        this.departmentModel = departmentModel;
    }
    async createUser(email, username, password, name, role = 'user', departmentId) {
        const passwordHash = await bcrypt.hash(password, 10);
        const created = await this.userModel.create({
            email,
            username,
            passwordHash,
            name,
            role,
            departmentId,
        });
        return created.get({ plain: true });
    }
    async findByUsername(username) {
        const user = await this.userModel.findOne({ where: { username } });
        return user ? user.get({ plain: true }) : undefined;
    }
    async validateUser(username, password) {
        console.log('validateUser', username, password);
        const user = await this.findByUsername(username);
        if (!user)
            return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        return valid ? user : null;
    }
    async findMe(id) {
        const me = await this.userModel.findOne({
            where: { id: id },
            attributes: { exclude: ['passwordHash'] },
        });
        return me ? me.get({ plain: true }) : undefined;
    }
    async findAll() {
        const users = await this.userModel.findAll();
        return users.map((u) => {
            const plain = u.get({ plain: true });
            const { passwordHash, ...rest } = plain;
            return rest;
        });
    }
    async findById(id) {
        const user = await this.userModel.findByPk(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const plain = user.get({ plain: true });
        const { passwordHash, ...rest } = plain;
        return rest;
    }
    async findEntityById(id) {
        const user = await this.userModel.findByPk(id);
        return user ? user.get({ plain: true }) : undefined;
    }
    async findByDepartment(userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const departmentId = user.departmentId;
        const users = await this.userModel.findAll({
            where: { departmentId },
            attributes: { exclude: ['passwordHash'] },
        });
        return users.map((u) => u.get({ plain: true }));
    }
    async update(id, dto) {
        const user = await this.userModel.findByPk(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.email)
            user.email = dto.email;
        if (dto.username)
            user.username = dto.username;
        if (dto.name)
            user.name = dto.name;
        if (dto.role)
            user.role = dto.role;
        if (dto.departmentId)
            user.departmentId = dto.departmentId;
        if (dto.password)
            user.passwordHash = await bcrypt.hash(dto.password, 10);
        if (dto.role === 'manager' && dto.departmentId) {
            user.departmentId = dto.departmentId;
        }
        await user.save();
        const department = await this.departmentModel.findByPk(dto.departmentId);
        if (department) {
            department.managerId = user.id;
            await department.save();
        }
        const plain = user.get({ plain: true });
        const { passwordHash, ...rest } = plain;
        return rest;
    }
    async remove(id) {
        const deleted = await this.userModel.destroy({ where: { id } });
        if (deleted === 0)
            throw new common_1.NotFoundException('User not found');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __param(1, (0, sequelize_1.InjectModel)(department_model_1.DepartmentModel)),
    __metadata("design:paramtypes", [Object, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map