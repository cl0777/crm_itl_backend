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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const customer_model_1 = require("./customer.model");
const customer_account_model_1 = require("./customer-account.model");
const user_model_1 = require("../users/user.model");
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let CustomersService = class CustomersService {
    constructor(customerModel, customerAccountModel, userModel, jwtService) {
        this.customerModel = customerModel;
        this.customerAccountModel = customerAccountModel;
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async create(dto, userId, addedByName) {
        const customer = await this.customerModel.create({
            ...dto,
            userId,
            addedBy: addedByName,
        });
        return customer.get({ plain: true });
    }
    async registerCustomer(dto) {
        const existing = await this.customerAccountModel.findOne({
            where: { email: dto.email },
        });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const adminUser = await user_model_1.UserModel.findOne({ where: { role: 'admin' } });
        const assignedUserId = adminUser?.id ?? null;
        let linkedCustomerId = dto.customerId ?? null;
        if (!linkedCustomerId) {
            if (!assignedUserId) {
                const anyUser = await user_model_1.UserModel.findOne();
                if (!anyUser) {
                    throw new common_1.NotFoundException('No system user found to assign customer');
                }
                linkedCustomerId = (await this.customerModel.create({
                    partyName: dto.partyName,
                    shortname: dto.shortname,
                    address1: dto.address1,
                    address2: dto.address2,
                    city: dto.city,
                    country: dto.country,
                    email: dto.email,
                    phone1: dto.phone1,
                    phone2: dto.phone2,
                    status: 'Active',
                    userId: anyUser.id,
                    addedBy: 'Website',
                })).id;
            }
            else {
                linkedCustomerId = (await this.customerModel.create({
                    partyName: dto.partyName,
                    shortname: dto.shortname,
                    address1: dto.address1,
                    address2: dto.address2,
                    city: dto.city,
                    country: dto.country,
                    email: dto.email,
                    phone1: dto.phone1,
                    phone2: dto.phone2,
                    status: 'Active',
                    userId: assignedUserId,
                    addedBy: 'Website',
                })).id;
            }
        }
        const account = await this.customerAccountModel.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
            customerId: linkedCustomerId,
        });
        const tokens = await this.issueTokensForCustomer(account);
        return {
            account: { id: account.id, name: account.name, email: account.email },
            ...tokens,
        };
    }
    async loginCustomer(dto) {
        const account = await this.customerAccountModel.findOne({
            where: { email: dto.email },
        });
        if (!account)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, account.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.issueTokensForCustomer(account);
        return {
            account: { id: account.id, name: account.name, email: account.email },
            ...tokens,
        };
    }
    async issueTokensForCustomer(account) {
        const payload = {
            sub: account.id,
            email: account.email,
            username: account.name,
            role: 'customer',
            accountType: 'customer',
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '30d',
        });
        return { accessToken };
    }
    async findAll(userId, userRole, userDepartmentId) {
        let where = {};
        if (userRole === 'admin') {
        }
        else if (userRole === 'manager') {
            let departmentId = userDepartmentId;
            if (!departmentId && userId) {
                const manager = await this.userModel.findByPk(userId, {
                    attributes: ['id', 'departmentId'],
                });
                departmentId = manager?.departmentId || undefined;
            }
            if (departmentId) {
                const deptUsers = await this.userModel.findAll({
                    where: { departmentId },
                    attributes: ['id'],
                });
                const userIds = deptUsers.map((u) => u.id);
                where = { userId: { [sequelize_2.Op.in]: userIds } };
                where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
            }
            else {
                return [];
            }
        }
        else if (userId) {
            where = { userId };
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        return this.customerModel.findAll({
            where,
            include: [{ model: user_model_1.UserModel, attributes: ['id', 'name'] }],
        });
    }
    async getCount(userId, userRole, userDepartmentId) {
        let where = {};
        if (userRole === 'admin') {
        }
        else if (userRole === 'manager') {
            let departmentId = userDepartmentId;
            if (!departmentId && userId) {
                const manager = await this.userModel.findByPk(userId, {
                    attributes: ['id', 'departmentId'],
                });
                departmentId = manager?.departmentId || undefined;
            }
            if (departmentId) {
                const deptUsers = await this.userModel.findAll({
                    where: { departmentId },
                    attributes: ['id'],
                });
                const userIds = deptUsers.map((u) => u.id);
                where = { userId: { [sequelize_2.Op.in]: userIds } };
                where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
            }
            else {
                return 0;
            }
        }
        else if (userId) {
            where = { userId };
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        return this.customerModel.count({ where });
    }
    async findOne(id, userId, userRole, userDepartmentId) {
        const where = { id };
        if (userRole === 'admin') {
        }
        else if (userRole === 'manager') {
            let departmentId = userDepartmentId;
            if (!departmentId && userId) {
                const manager = await this.userModel.findByPk(userId, {
                    attributes: ['id', 'departmentId'],
                });
                departmentId = manager?.departmentId || undefined;
            }
            if (departmentId) {
                const deptUsers = await this.userModel.findAll({
                    where: { departmentId },
                    attributes: ['id'],
                });
                const userIds = deptUsers.map((u) => u.id);
                where.userId = { [sequelize_2.Op.in]: userIds };
            }
            else {
                throw new common_1.NotFoundException('Customer not found');
            }
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        else if (userId) {
            where.userId = userId;
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        const customer = await this.customerModel.findOne({
            where,
            include: [{ model: user_model_1.UserModel, attributes: ['id', 'name'] }],
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer.get({ plain: true });
    }
    async update(id, dto, userId, userRole, userDepartmentId) {
        const where = { id };
        if (userRole === 'admin') {
        }
        else if (userRole === 'manager') {
            let departmentId = userDepartmentId;
            if (!departmentId && userId) {
                const manager = await this.userModel.findByPk(userId, {
                    attributes: ['id', 'departmentId'],
                });
                departmentId = manager?.departmentId || undefined;
            }
            if (departmentId) {
                const deptUsers = await this.userModel.findAll({
                    where: { departmentId },
                    attributes: ['id'],
                });
                const userIds = deptUsers.map((u) => u.id);
                where.userId = { [sequelize_2.Op.in]: userIds };
            }
            else {
                throw new common_1.NotFoundException('Customer not found');
            }
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        else if (userId) {
            where.userId = userId;
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        const customer = await this.customerModel.findOne({ where });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        await customer.update(dto);
        return customer.get({ plain: true });
    }
    async remove(id, userId, userRole, userDepartmentId) {
        const where = { id };
        if (userRole === 'admin') {
        }
        else if (userRole === 'manager') {
            let departmentId = userDepartmentId;
            if (!departmentId && userId) {
                const manager = await this.userModel.findByPk(userId, {
                    attributes: ['id', 'departmentId'],
                });
                departmentId = manager?.departmentId || undefined;
            }
            if (departmentId) {
                const deptUsers = await this.userModel.findAll({
                    where: { departmentId },
                    attributes: ['id'],
                });
                const userIds = deptUsers.map((u) => u.id);
                where.userId = { [sequelize_2.Op.in]: userIds };
            }
            else {
                throw new common_1.NotFoundException('Customer not found');
            }
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        else if (userId) {
            where.userId = userId;
            where.addedBy = { [sequelize_2.Op.ne]: 'Website' };
        }
        const deleted = await this.customerModel.destroy({ where });
        if (deleted === 0) {
            throw new common_1.NotFoundException('Customer not found');
        }
    }
    async importFromXlsx(fileBuffer, userId, addedByName) {
        console.log('[IMPORT] Starting import process');
        console.log('[IMPORT] File buffer size:', fileBuffer?.length || 0);
        console.log('[IMPORT] User ID:', userId);
        console.log('[IMPORT] Added By:', addedByName);
        if (!fileBuffer || fileBuffer.length === 0) {
            console.error('[IMPORT] Error: No file uploaded');
            throw new common_1.NotFoundException('No file uploaded');
        }
        console.log('[IMPORT] Reading XLSX file...');
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        console.log('[IMPORT] Workbook sheets:', workbook.SheetNames);
        const firstSheetName = workbook.SheetNames[0];
        console.log('[IMPORT] Using sheet:', firstSheetName);
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: '',
            raw: false,
            blankrows: false,
            dateNF: 'yyyy-mm-dd',
        });
        console.log('[IMPORT] Total rows found:', rows.length);
        if (rows.length > 0) {
            console.log('[IMPORT] First row sample:', Object.keys(rows[0]));
        }
        const normalize = (key) => String(key || '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/_/g, '')
            .replace(/-/g, '');
        const getVal = (row, candidates) => {
            const normalizedRow = {};
            for (const k of Object.keys(row)) {
                normalizedRow[normalize(k)] = row[k];
            }
            for (const candidate of candidates) {
                if (row[candidate] !== undefined && row[candidate] !== '') {
                    return row[candidate];
                }
                const normCandidate = normalize(candidate);
                if (normalizedRow[normCandidate] !== undefined &&
                    normalizedRow[normCandidate] !== '') {
                    return normalizedRow[normCandidate];
                }
            }
            return '';
        };
        const created = [];
        let skippedCount = 0;
        let processedCount = 0;
        console.log('[IMPORT] Processing rows...');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            processedCount++;
            if (i === 0 || (i + 1) % 10 === 0) {
                console.log(`[IMPORT] Processing row ${i + 1}/${rows.length}`);
            }
            const dto = {
                partyName: getVal(row, [
                    'partyName',
                    'Party Name',
                    'party_name',
                    'PartyName',
                    'Company Name',
                    'companyName',
                    'company_name',
                    'CompanyName',
                ]),
                shortname: getVal(row, [
                    'shortname',
                    'Short Name',
                    'short_name',
                    'ShortName',
                    'Represented Name',
                    'representedName',
                    'represented_name',
                    'RepresentedName',
                ]),
                address1: getVal(row, [
                    'address1',
                    'Address 1',
                    'address',
                    'Address',
                    'Address1',
                ]),
                address2: getVal(row, ['address2', 'Address 2', 'Address2']) || undefined,
                city: getVal(row, ['city', 'City']),
                country: getVal(row, ['country', 'Country']),
                email: getVal(row, ['email', 'Email']),
                phone1: getVal(row, [
                    'phone1',
                    'Phone 1',
                    'phone',
                    'Phone',
                    'Phone1',
                    'Primary Phone',
                    'primaryPhone',
                    'primary_phone',
                    'PrimaryPhone',
                ]),
                phone2: getVal(row, [
                    'phone2',
                    'Phone 2',
                    'Phone2',
                    'Secondary Phone',
                    'secondaryPhone',
                    'secondary_phone',
                    'SecondaryPhone',
                ]) || undefined,
                status: getVal(row, ['status', 'Status']) || 'Active',
            };
            if (!dto.partyName ||
                !dto.shortname ||
                !dto.address1 ||
                !dto.city ||
                !dto.country ||
                !dto.email ||
                !dto.phone1 ||
                !dto.status) {
                skippedCount++;
                console.log(`[IMPORT] Row ${i + 1} skipped - missing required fields:`, {
                    partyName: !!dto.partyName,
                    shortname: !!dto.shortname,
                    address1: !!dto.address1,
                    city: !!dto.city,
                    country: !!dto.country,
                    email: !!dto.email,
                    phone1: !!dto.phone1,
                    status: !!dto.status,
                });
                continue;
            }
            const rowUserName = getVal(row, [
                'userName',
                'User Name',
                'user',
                'User',
            ]);
            let assignedUserId = userId;
            let assignedAddedBy = addedByName;
            if (rowUserName) {
                console.log(`[IMPORT] Row ${i + 1} - Looking for user:`, rowUserName);
                const userEntity = await user_model_1.UserModel.findOne({
                    where: { name: rowUserName },
                });
                if (userEntity) {
                    assignedUserId = userEntity.id;
                    assignedAddedBy = userEntity.name;
                    console.log(`[IMPORT] Row ${i + 1} - Assigned to user:`, userEntity.name, `(ID: ${userEntity.id})`);
                }
                else {
                    console.log(`[IMPORT] Row ${i + 1} - User not found:`, rowUserName, '- using default user');
                }
            }
            try {
                const customer = await this.customerModel.create({
                    ...dto,
                    userId: assignedUserId,
                    addedBy: assignedAddedBy,
                });
                created.push(customer.get({ plain: true }));
                console.log(`[IMPORT] Row ${i + 1} - Created customer:`, dto.partyName, `(ID: ${customer.id})`);
            }
            catch (error) {
                console.error(`[IMPORT] Row ${i + 1} - Error creating customer:`, error?.message);
                console.error(`[IMPORT] Row ${i + 1} - DTO:`, JSON.stringify(dto, null, 2));
                throw error;
            }
        }
        console.log('[IMPORT] Import completed:', {
            totalRows: rows.length,
            processed: processedCount,
            created: created.length,
            skipped: skippedCount,
        });
        return { count: created.length, items: created };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(customer_model_1.CustomerModel)),
    __param(1, (0, sequelize_1.InjectModel)(customer_account_model_1.CustomerAccountModel)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, Object, Object, jwt_1.JwtService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map