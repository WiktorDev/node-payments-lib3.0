import {IsEmail, IsNumber, IsOptional, IsUrl} from "class-validator";

export class SkillHostParams {
    @IsNumber()
    amount: number

    @IsOptional()
    @IsUrl()
    webhook: string

    @IsOptional()
    description: string

    @IsOptional()
    @IsUrl()
    returnLink: string

    @IsOptional()
    @IsEmail()
    buyerEmail: string
}