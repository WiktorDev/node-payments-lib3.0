import {IsNumber, IsOptional, IsString, IsUrl} from "class-validator";

export class SimpayDirectbillingParams {
    @IsNumber()
    amount: number

    amountType: string = 'gross'

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    control?: string

    returns: ReturnUrls = new ReturnUrls();

    @IsOptional()
    phoneNumber?: string

    signature: string
}

class ReturnUrls {
    @IsOptional()
    @IsUrl()
    success?: string

    @IsOptional()
    @IsUrl()
    failure?: string
}
