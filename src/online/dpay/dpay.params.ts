import {IsNumber, IsString} from "class-validator";

export class DpayParams {
    private service: string

    @IsNumber()
    value: number

    @IsString()
    url_success: string

    @IsString()
    url_fail: string

    @IsString()
    url_ipn: string
    accept_tos: number = 1
    checksum: string

    installment?: boolean
    creditcard?: boolean
    paysafecard?: boolean
    paypal?: boolean
    nobanks?: boolean
    channel?: string
    email?: string
    client_name?: string
    client_surname?: string
    description?: string
    custom?: string
    style?: string

    constructor(service: string) {
        this.service = service;
    }
}