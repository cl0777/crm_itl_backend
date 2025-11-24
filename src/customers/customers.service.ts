import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CustomerModel } from './customer.model';
import { CustomerAccountModel } from './customer-account.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserModel } from '../users/user.model';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(CustomerModel)
    private readonly customerModel: typeof CustomerModel,
    @InjectModel(CustomerAccountModel)
    private readonly customerAccountModel: typeof CustomerAccountModel,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateCustomerDto, userId: number, addedByName: string) {
    const customer = await this.customerModel.create({
      ...dto,
      userId,
      addedBy: addedByName,
    });
    return customer.get({ plain: true });
  }

  // --- Customer portal auth ---
  async registerCustomer(dto: CustomerRegisterDto) {
    const existing = await this.customerAccountModel.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    // Determine which CRM user to assign as the owner of auto-created customers
    const adminUser = await UserModel.findOne({ where: { role: 'admin' } });
    const assignedUserId = adminUser?.id ?? null;

    // If customerId is not provided, create a customer record from the registration details
    let linkedCustomerId = dto.customerId ?? null;
    if (!linkedCustomerId) {
      if (!assignedUserId) {
        // Fallback: ensure we always have a userId to satisfy FK
        const anyUser = await UserModel.findOne();
        if (!anyUser) {
          throw new NotFoundException(
            'No system user found to assign customer',
          );
        }
        linkedCustomerId = (
          await this.customerModel.create({
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
          })
        ).id;
      } else {
        linkedCustomerId = (
          await this.customerModel.create({
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
          })
        ).id;
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

  async loginCustomer(dto: CustomerLoginDto) {
    const account = await this.customerAccountModel.findOne({
      where: { email: dto.email },
    });
    if (!account) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokensForCustomer(account);
    return {
      account: { id: account.id, name: account.name, email: account.email },
      ...tokens,
    };
  }

  private async issueTokensForCustomer(account: CustomerAccountModel) {
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

  async findAll(userId?: number, userRole?: string, userDepartmentId?: number) {
    let where: any = {};
    if (userRole === 'admin') {
      // Admin sees all
    } else if (userRole === 'manager' && userDepartmentId) {
      // Manager sees customers from users in their department
      const deptUsers = await UserModel.findAll({
        where: { departmentId: userDepartmentId },
        attributes: ['id'],
      });
      const userIds = deptUsers.map((u) => u.id);
      where = { userId: { [Op.in]: userIds } };
      // Exclude customers from website (only admin can see them)
      where.addedBy = { [Op.ne]: 'Website' };
    } else if (userId) {
      // Regular user sees only their own customers
      where = { userId };
      // Exclude customers from website (only admin can see them)
      where.addedBy = { [Op.ne]: 'Website' };
    }
    return this.customerModel.findAll({
      where,
      include: [{ model: UserModel, attributes: ['id', 'name'] }],
    });
  }

  async getCount(userId?: number, userRole?: string, userDepartmentId?: number) {
    let where: any = {};
    if (userRole === 'admin') {
      // Admin sees all
    } else if (userRole === 'manager' && userDepartmentId) {
      // Manager sees customers from users in their department
      const deptUsers = await UserModel.findAll({
        where: { departmentId: userDepartmentId },
        attributes: ['id'],
      });
      const userIds = deptUsers.map((u) => u.id);
      where = { userId: { [Op.in]: userIds } };
      // Exclude customers from website (only admin can see them)
      where.addedBy = { [Op.ne]: 'Website' };
    } else if (userId) {
      // Regular user sees only their own customers
      where = { userId };
      // Exclude customers from website (only admin can see them)
      where.addedBy = { [Op.ne]: 'Website' };
    }
    return this.customerModel.count({ where });
  }

  async findOne(id: number, userId?: number, userRole?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    // Exclude customers from website for non-admin users
    if (userRole !== 'admin') {
      where.addedBy = { [Op.ne]: 'Website' };
    }
    const customer = await this.customerModel.findOne({
      where,
      include: [{ model: UserModel, attributes: ['id', 'name'] }],
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer.get({ plain: true });
  }

  async update(id: number, dto: UpdateCustomerDto, userId?: number, userRole?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    // Exclude customers from website for non-admin users
    if (userRole !== 'admin') {
      where.addedBy = { [Op.ne]: 'Website' };
    }
    const customer = await this.customerModel.findOne({ where });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await customer.update(dto);
    return customer.get({ plain: true });
  }

  async remove(id: number, userId?: number, userRole?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    // Exclude customers from website for non-admin users
    if (userRole !== 'admin') {
      where.addedBy = { [Op.ne]: 'Website' };
    }
    const deleted = await this.customerModel.destroy({ where });
    if (deleted === 0) {
      throw new NotFoundException('Customer not found');
    }
  }

  async importFromXlsx(
    fileBuffer: Buffer,
    userId: number,
    addedByName: string,
  ) {
    console.log('[IMPORT] Starting import process');
    console.log('[IMPORT] File buffer size:', fileBuffer?.length || 0);
    console.log('[IMPORT] User ID:', userId);
    console.log('[IMPORT] Added By:', addedByName);

    if (!fileBuffer || fileBuffer.length === 0) {
      console.error('[IMPORT] Error: No file uploaded');
      throw new NotFoundException('No file uploaded');
    }

    console.log('[IMPORT] Reading XLSX file...');
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    console.log('[IMPORT] Workbook sheets:', workbook.SheetNames);
    
    const firstSheetName = workbook.SheetNames[0];
    console.log('[IMPORT] Using sheet:', firstSheetName);
    
    const worksheet = workbook.Sheets[firstSheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      blankrows: false,
      dateNF: 'yyyy-mm-dd',
    });
    
    console.log('[IMPORT] Total rows found:', rows.length);
    if (rows.length > 0) {
      console.log('[IMPORT] First row sample:', Object.keys(rows[0]));
    }

    const normalize = (key: string) =>
      String(key || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/_/g, '')
        .replace(/-/g, '');

    const getVal = (row: Record<string, any>, candidates: string[]) => {
      const normalizedRow: Record<string, any> = {};
      for (const k of Object.keys(row)) {
        normalizedRow[normalize(k)] = row[k];
      }
      for (const candidate of candidates) {
        if (row[candidate] !== undefined && row[candidate] !== '') {
          return row[candidate];
        }
        const normCandidate = normalize(candidate);
        if (
          normalizedRow[normCandidate] !== undefined &&
          normalizedRow[normCandidate] !== ''
        ) {
          return normalizedRow[normCandidate];
        }
      }
      return '';
    };

    const created: any[] = [];
    let skippedCount = 0;
    let processedCount = 0;

    console.log('[IMPORT] Processing rows...');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      processedCount++;
      
      if (i === 0 || (i + 1) % 10 === 0) {
        console.log(`[IMPORT] Processing row ${i + 1}/${rows.length}`);
      }

      const dto: CreateCustomerDto = {
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
        address2:
          getVal(row, ['address2', 'Address 2', 'Address2']) || undefined,
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
      } as CreateCustomerDto;

      if (
        !dto.partyName ||
        !dto.shortname ||
        !dto.address1 ||
        !dto.city ||
        !dto.country ||
        !dto.email ||
        !dto.phone1 ||
        !dto.status
      ) {
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

      // Optional per-row user assignment by user name in the sheet
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
        const userEntity = await UserModel.findOne({
          where: { name: rowUserName },
        });
        if (userEntity) {
          assignedUserId = userEntity.id;
          assignedAddedBy = userEntity.name;
          console.log(`[IMPORT] Row ${i + 1} - Assigned to user:`, userEntity.name, `(ID: ${userEntity.id})`);
        } else {
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
      } catch (error: any) {
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
}
