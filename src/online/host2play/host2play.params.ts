import {IsCurrency, IsEmail, IsNumber, IsOptional, IsString, IsUrl} from "class-validator";

export class Host2playParams {
  @IsOptional()
  @IsEmail()
  customerEmail: string

  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsCurrency()
  currency: string

  @IsOptional()
  @IsUrl()
  notificationUrl: string

  @IsOptional()
  @IsUrl()
  successRedirectUrl: string

  @IsOptional()
  @IsUrl()
  cancelRedirectUrl: string

  @IsOptional()
  @IsNumber()
  expires: number

  @IsOptional()
  @IsString()
  description: string
}
