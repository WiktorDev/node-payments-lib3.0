import {BasePayment} from "../../../BasePayment";
import {CashbillParams} from "./cashbill.params";
import {PaymentException} from "../../../exceptions/payment.exception";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";
import {CashbillTransactionEntity} from "./entity/cashbill.transaction.entity";
import {CashbillPaymentChannelsEntity} from "./entity/cashbill.paymentChannels.entity";

export class CashbillPayment extends BasePayment {
    private apiUrl: string
    private shopKey: string;
    public params: CashbillParams;

    constructor(shopId: string, shopKey: string, sandboxMode: boolean = false) {
        super();
        this.shopKey = shopKey;
        this.params = new CashbillParams();
        this.apiUrl = `https://pay.cashbill.pl/${sandboxMode ? 'testws' : 'ws'}/rest/payment/${shopId}`
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        this.params.sign = hash(HashingMethodsEnum.SHA1, `${Object.values(this.params).join('')}${this.shopKey}`)

        const response = await this.doRequest(this.apiUrl, "POST", this.params, {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8'
        })
        if (response.status !== 200)
            throw new PaymentException(`[CashBill]: ${response.data.errorMessage}`)

        return new PaymentGeneratedEntity(response.data['redirectUrl'], response.data['id'])
    }

    async getTransactionInfo(transactionId: string): Promise<CashbillTransactionEntity>{
        const signature = hash(HashingMethodsEnum.SHA1, transactionId + this.shopKey)
        const response = await this.doRequest(`${this.apiUrl}/${transactionId}?sign=${signature}`)
        if (response.status !== 200)
            throw new PaymentException(`[CashBill]: ${response.data.errorMessage}`)
        return response.data
    }

    async setRedirectUrls(transactionId: string): Promise<void> {
        if (!this.params.returnUrl || !this.params.negativeReturnUrl)
            throw new PaymentException('returnUrl and negativeReturnUrl is required!')

        const response = await this.doRequest(`${this.apiUrl}/${transactionId}`, "PUT", {
            returnUrl: this.params.returnUrl,
            negativeReturnUrl: this.params.negativeReturnUrl,
            sign: hash(HashingMethodsEnum.SHA1, transactionId + this.params.returnUrl + this.params.negativeReturnUrl + this.shopKey)
        }, {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF8'
        })

        if (response.status !== 204)
            throw new PaymentException(`[CashBill]: ${response.data.errorMessage}`)

    }

    async getPaymentChannels(): Promise<CashbillPaymentChannelsEntity[]>{
        const response = await this.doRequest(this.apiUrl.replace('payment', 'paymentchannels'))

        if (response.status !== 200)
            throw new PaymentException(`[CashBill]: ${response.data.errorMessage}`)

        return response.data
    }
}