import {IsString} from "class-validator";

export class Przelewy24Params {
    private merchantId: number
    private posId: number

    @IsString()
    sessionId: string
    amount: number
    currency: string
    description: string
    email: string
    client?: string
    address?: string
    zip?: string
    city?: string
    country?: string
    phone?: string
    language?: string
    method?: string
    urlReturn?: string
    urlStatus?: string
    timeLimit?: number
    channel?: number
    waitForResult?: boolean
    regulationAccept?: boolean
    shipping?: number
    transferLabel?: string
    methodRefId?: string
    additional?: Array<any>
    sign: string
    constructor(merchantId: number, posId: number) {
        this.merchantId = merchantId;
        this.posId = posId
    }
}
