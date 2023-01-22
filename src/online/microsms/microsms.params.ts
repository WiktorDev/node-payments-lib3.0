import {hash} from "../../utils/crypto.function";

export class MicrosmsParams {
    amount: number
    control?: string
    returnUrlc?: string
    returnUrl?: string
    description?: string
    private shopid: number
    signature: string

    constructor(shopId: number) {
        this.shopid = shopId
    }
}