import {BasePayment} from "../../../BasePayment";
import {PaybylinkPaysafecardParams} from "./paybylinkPaysafecard.params";
import {validateObject} from "../../../utils/validate.function";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";
import * as querystring from "querystring";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {isJson} from "../../../utils/isJson.function";
import {PaymentException} from "../../../exceptions/payment.exception";

export class PaybylinkPaysafecardPayment extends BasePayment {
    public params: PaybylinkPaysafecardParams
    private readonly pin: string;
    private readonly userId: number

    constructor(userId: number, shopId: number, pin: string) {
        super();
        this.pin = pin
        this.userId = userId
        this.params = new PaybylinkPaysafecardParams(userId, shopId)
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(PaybylinkPaysafecardParams, this.params)
        this.params.hash = hash(HashingMethodsEnum.SHA256, `${this.userId}${this.pin}${this.params.amount}`)
        this.params.get_pid = true

        const response = await this.doRequest('https://paybylink.pl/api/psc/', 'POST', this.params, {
            "Content-Type": "application/x-www-form-urlencoded"
        })

        if (!isJson(response.data))
            throw new PaymentException(`[PayByLink] ${response.data.replace('\n', '')}`)

        return new PaymentGeneratedEntity(response.data['url'], response.data['pid'])
    }
}
