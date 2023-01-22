import {IsEmail, IsNumber, IsOptional, IsPostalCode, IsString, IsUrl} from "class-validator";

export class DotpayParams {
    readonly api_version: string = 'next'

    @IsNumber()
    private id: number

    @IsNumber()
    amount: number

    @IsString()
    currency: string

    @IsString()
    description: string

    @IsOptional()
    @IsString()
    channel?: string

    @IsOptional()
    @IsNumber()
    ch_lock?: number

    @IsOptional()
    @IsNumber()
    ignore_last_payment_channel?: number

    @IsOptional()
    @IsString()
    channel_groups?: string

    @IsOptional()
    @IsUrl()
    url?: string

    @IsOptional()
    @IsString()
    type?: string

    @IsOptional()
    @IsString()
    buttontext?: string

    @IsOptional()
    @IsNumber()
    bylaw?: number

    @IsOptional()
    @IsNumber()
    personal_data?: number

    @IsOptional()
    @IsUrl()
    urlc?: string

    @IsOptional()
    @IsString()
    expirationDate?: string

    @IsOptional()
    @IsString()
    control?: string

    @IsOptional()
    @IsString()
    firstname?: string

    @IsOptional()
    @IsString()
    lastname?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    street?: string

    @IsOptional()
    @IsString()
    street_n1?: string

    @IsOptional()
    @IsString()
    street_n2?: string

    @IsOptional()
    @IsString()
    state?: string

    @IsOptional()
    @IsString()
    addr3?: string

    @IsOptional()
    @IsString()
    city?: string

    @IsOptional()
    @IsPostalCode()
    postcode?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    country?: string

    @IsOptional()
    @IsString()
    lang?: string

    @IsOptional()
    @IsString()
    customer?: string

    @IsOptional()
    @IsString()
    deladdr?: string

    @IsOptional()
    @IsString()
    p_info?: string

    @IsOptional()
    @IsEmail()
    p_email?: string

    @IsOptional()
    @IsString()
    blik_code?: string

    @IsOptional()
    @IsString()
    gp_token?: string

    @IsOptional()
    @IsString()
    ap_token?: string

    chk?: string
    paramsList?: string

    constructor(shopId: number) {
        this.id = shopId
    }
}
