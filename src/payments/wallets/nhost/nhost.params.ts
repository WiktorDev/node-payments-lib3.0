import {IsNumber, IsOptional, IsUrl} from "class-validator";

export class NHostParams {
    @IsNumber()
    amount: number

    @IsOptional()
    description: string

    @IsOptional()
    @IsUrl()
    success_url: string

    @IsOptional()
    @IsUrl()
    cancel_url: string

    @IsOptional()
    @IsUrl()
    webhook_url: string
}