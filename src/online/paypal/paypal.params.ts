import {IsNumber, IsString, IsUrl} from "class-validator";

export class PaypalParams {
  @IsUrl()
  return_url: string

  @IsUrl()
  cancel_url: string

  @IsString()
  itemName: string

  @IsNumber()
  itemPrice: number

  @IsString()
  description: string
}
