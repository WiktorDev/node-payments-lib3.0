import {IsNumber, IsUrl} from "class-validator";

export class IcehostParams {
  @IsNumber()
  amount: number

  @IsUrl()
  redirectUrl: string

  @IsUrl()
  webhookUrl: string
}
