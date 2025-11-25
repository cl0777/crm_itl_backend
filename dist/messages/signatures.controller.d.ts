import { SignaturesService } from './signatures.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
export declare class SignaturesController {
    private readonly signaturesService;
    constructor(signaturesService: SignaturesService);
    create(dto: CreateSignatureDto, req: any): Promise<import("./signature.model").SignatureAttributes>;
    findAll(req: any): Promise<import("./signature.model").SignatureAttributes[]>;
    getDefault(req: any): Promise<import("./signature.model").SignatureAttributes | null>;
    findOne(id: string, req: any): Promise<import("./signature.model").SignatureAttributes>;
    update(id: string, dto: UpdateSignatureDto, req: any): Promise<import("./signature.model").SignatureAttributes>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
