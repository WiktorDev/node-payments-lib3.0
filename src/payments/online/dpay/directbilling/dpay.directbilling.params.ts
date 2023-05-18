import {IsNumber, IsString} from "class-validator";

export class DpayDirectbillingParams {
    @IsNumber()
    value: number

    @IsString()
    url_success: string

    @IsString()
    url_fail: string

    checksum: string

    custom?: string
}