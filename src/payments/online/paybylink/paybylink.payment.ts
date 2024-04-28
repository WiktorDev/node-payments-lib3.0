import {BasePayment} from "../../../BasePayment";
import {PaybylinkParams} from "./paybylink.params";
import {validateObject} from "../../../utils/validate.function";
import {PaymentException} from "../../../exceptions/payment.exception";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";
import {hash} from "../../../utils/crypto.function";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {isNull} from "util";

export class PaybylinkPayment extends BasePayment {
    public readonly params: PaybylinkParams
    private readonly secret_hash: string
    private readonly shopId: number

    constructor(shopId: number, hash: string) {
        super();
        this.secret_hash = hash
        this.shopId = shopId
        this.params = new PaybylinkParams(shopId)
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(PaybylinkParams, this.params)
        this.params.price = this.params.price.toFixed(2)
        this.params.signature = hash(HashingMethodsEnum.SHA256, `${this.secret_hash}|${Object.values(this.params).join('|')}`)
        const response = await this.doRequest('https://secure.pbl.pl/api/v1/transfer/generate', 'POST', this.params)
        if (response.status !== 200)
            throw new PaymentException(`[PayByLink] ${response.data.error}`)

        return new PaymentGeneratedEntity(response.data['url'], response.data['transactionId'])
    }

    public async generateBlikWhiteLabelTransaction(price: number, code: string, customerIp: string, control?: string, notifyPaymentURL?: string, notifyStatusURL?: string) {
        const data = {
            shopId: this.shopId,
            price: price,
            code: code,
            customerIP: customerIp,
            control: control,
            notifyPaymentURL: notifyPaymentURL,
            notifyStatusURL: notifyStatusURL
        }



        console.log(isNull(control))
        const response = await this.doRequest('https://api-v4.yshop.pl/shops/4/payments/notification/microsms_transfer', 'POST')
        console.log(response.data)
    }
    public generateNotificationHash(payload: any): string {
        return hash(HashingMethodsEnum.SHA256, [
            this.secret_hash,
            payload['transactionId'],
            payload['control'],
            payload['email'],
            payload['amountPaid'],
            payload['notificationAttempt'],
            payload['paymentType'],
            payload['apiVersion']
        ].join('|'))
    }
}
