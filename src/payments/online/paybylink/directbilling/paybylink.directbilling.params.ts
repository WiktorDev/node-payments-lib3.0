import {IsNumber, IsString} from "class-validator";

export class PaybylinkDirectbillingParams {
    @IsNumber()
    price: number

    @IsString()
    description: string

    @IsString()
    control: string

    signature: string
}
