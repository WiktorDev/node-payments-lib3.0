import {IsNumber, IsOptional, IsString, IsUrl} from "class-validator";

export class PaybylinkPaysafecardParams {
    private userid: number
    private shopid: number

    @IsNumber()
    amount: number

    @IsUrl()
    return_ok: string

    @IsUrl()
    return_fail: string

    @IsUrl()
    url: string

    @IsString()
    control: string

    hash: string

    get_pid: boolean

    @IsOptional()
    @IsString()
    description?: string

    constructor(userId: number, shopId: number) {
        this.userid = userId
        this.shopid = shopId
    }
}
