import {IsIn, IsNumber, IsOptional, IsString, IsUrl, MinLength} from "class-validator";

export class ChunkServeParams {
    @IsNumber()
    amount: number

    @IsUrl()
    redirect_url: string

    @IsUrl()
    webhook_url: string

    @IsString()
    @MinLength(1)
    title: string

    @IsOptional()
    @IsIn(["cashbill", "stripe"])
    provider: string
}