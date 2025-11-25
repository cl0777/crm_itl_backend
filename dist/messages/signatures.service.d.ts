import { SignatureModel } from './signature.model';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
export declare class SignaturesService {
    private readonly signatureModel;
    constructor(signatureModel: typeof SignatureModel);
    create(dto: CreateSignatureDto, userId: number): Promise<import("./signature.model").SignatureAttributes>;
    findAll(userId: number): Promise<import("./signature.model").SignatureAttributes[]>;
    findOne(id: number, userId: number): Promise<import("./signature.model").SignatureAttributes>;
    update(id: number, dto: UpdateSignatureDto, userId: number): Promise<import("./signature.model").SignatureAttributes>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
    }>;
    getDefault(userId: number): Promise<import("./signature.model").SignatureAttributes | null>;
}
