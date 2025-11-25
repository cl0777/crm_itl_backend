import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SignatureModel } from './signature.model';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { marked } from 'marked';
import { Op } from 'sequelize';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectModel(SignatureModel)
    private readonly signatureModel: typeof SignatureModel,
  ) {}

  async create(dto: CreateSignatureDto, userId: number) {
    // Generate HTML from markdown
    const contentHtml = (await marked.parse(dto.content || '')) as string;

    // If this is set as default, unset other defaults for this user
    if (dto.isDefault) {
      await this.signatureModel.update(
        { isDefault: false },
        { where: { userId, isDefault: true } },
      );
    }

    const signature = await this.signatureModel.create({
      ...dto,
      contentHtml,
      userId,
      isDefault: dto.isDefault ?? false,
    });

    return signature.get({ plain: true });
  }

  async findAll(userId: number) {
    const signatures = await this.signatureModel.findAll({
      where: { userId },
      order: [
        ['isDefault', 'DESC'], // Default signature first
        ['createdAt', 'DESC'],
      ],
    });

    return signatures.map((s) => s.get({ plain: true }));
  }

  async findOne(id: number, userId: number) {
    const signature = await this.signatureModel.findOne({
      where: { id, userId },
    });

    if (!signature) {
      throw new NotFoundException('Signature not found');
    }

    return signature.get({ plain: true });
  }

  async update(id: number, dto: UpdateSignatureDto, userId: number) {
    const signature = await this.signatureModel.findOne({
      where: { id, userId },
    });

    if (!signature) {
      throw new NotFoundException('Signature not found');
    }

    // If setting as default, unset other defaults for this user
    if (dto.isDefault === true) {
      await this.signatureModel.update(
        { isDefault: false },
        {
          where: {
            userId,
            isDefault: true,
            id: { [Op.ne]: id }, // Exclude current signature
          },
        },
      );
    }

    // Update contentHtml if content is being updated
    const updateData: any = { ...dto };
    if (dto.content !== undefined) {
      updateData.contentHtml = (await marked.parse(dto.content)) as string;
    }

    await signature.update(updateData);

    return signature.get({ plain: true });
  }

  async remove(id: number, userId: number) {
    const signature = await this.signatureModel.findOne({
      where: { id, userId },
    });

    if (!signature) {
      throw new NotFoundException('Signature not found');
    }

    await signature.destroy();

    return { success: true };
  }

  async getDefault(userId: number) {
    const signature = await this.signatureModel.findOne({
      where: { userId, isDefault: true },
    });

    return signature ? signature.get({ plain: true }) : null;
  }
}

