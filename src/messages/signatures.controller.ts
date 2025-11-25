import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SignaturesService } from './signatures.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@ApiTags('signatures')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'signatures', version: '1' })
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Post()
  @ApiOkResponse({ description: 'Create a new email signature' })
  async create(@Body() dto: CreateSignatureDto, @Req() req: any) {
    return this.signaturesService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOkResponse({ description: 'Get all signatures for the current user' })
  async findAll(@Req() req: any) {
    return this.signaturesService.findAll(req.user.userId);
  }

  @Get('default')
  @ApiOkResponse({ description: 'Get the default signature for the current user' })
  async getDefault(@Req() req: any) {
    return this.signaturesService.getDefault(req.user.userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get a signature by id' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.signaturesService.findOne(Number(id), req.user.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update a signature' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSignatureDto,
    @Req() req: any,
  ) {
    return this.signaturesService.update(Number(id), dto, req.user.userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a signature' })
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.signaturesService.remove(Number(id), req.user.userId);
    return { success: true };
  }
}

