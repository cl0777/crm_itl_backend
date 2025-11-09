export declare class CreateOrderDto {
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    weightKg: number;
    shipmentType: string;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    declaredValueUsd?: number;
    description?: string;
    totalAmount?: number;
    timeline?: string;
}
