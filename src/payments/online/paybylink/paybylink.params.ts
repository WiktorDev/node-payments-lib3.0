import {IsEmail, IsNumber, IsOptional, IsString, IsUrl} from "class-validator";

export class PaybylinkParams {
    private shopId: number

    price: any

    @IsOptional()
    @IsString()
    control?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsUrl()
    notifyURL?: string

    @IsOptional()
    @IsUrl()
    returnUrlSuccess?: string

    @IsOptional()
    returnUrlSuccessTidPass?: boolean

    @IsOptional()
    hideReceiver?: boolean

    @IsOptional()
    @IsString()
    customFinishNote?: string

    signature: string

    constructor(shopId: number) {
        this.shopId = shopId
    }
}
