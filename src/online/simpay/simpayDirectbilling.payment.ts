import {BasePayment} from "../../BasePayment";
import {SimpayDirectbillingParams} from "./simpayDirectbilling.params";
import {validateObject} from "../../utils/validate.function";
import {hash} from "../../utils/crypto.function";
import {HashingMethodsEnum} from "../../enums/HashingMethodsEnum";
import {PaymentException} from "../../exceptions/payment.exception";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";

export class SimpayDirectbillingPayment extends BasePayment {
    private readonly apikey: string
    private readonly apiPassword: string
    private readonly serviceId: number
    private readonly serviceHash: string
    public readonly params: SimpayDirectbillingParams

    constructor(apikey: string, apiPassword: string, serviceId: number, serviceHash: string) {
        super();
        this.apikey = apikey
        this.apiPassword = apiPassword
        this.serviceId = serviceId
        this.serviceHash = serviceHash
        this.params = new SimpayDirectbillingParams()
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity>{
        await validateObject(SimpayDirectbillingParams, this.params)
        this.params.signature = this.getPaymentSignature()

        const response = await this.doRequest(`https://api.simpay.pl/directbilling/${this.serviceId}/transactions`, 'POST', this.params, {
            'X-SIM-KEY': this.apikey,
            'X-SIM-PASSWORD': this.apiPassword
        })

        if (response && response.status !== 200)
            throw new PaymentException(`[SimPay] ${response.data['message']}`)

        return new PaymentGeneratedEntity(response.data['data']['redirectUrl'], response.data['data']['transactionId'])
    }

    private getPaymentSignature(): string {
        const array = []
        array.push(this.params.amount)
        array.push(this.params.amountType)
        if (this.params.description) array.push(this.params.description)
        if (this.params.control) array.push(this.params.control)
        if (this.params.returns.success) array.push(this.params.returns.success)
        if (this.params.returns.failure) array.push(this.params.returns.failure)
        if (this.params.phoneNumber) array.push(this.params.phoneNumber)

        array.push(this.serviceHash)

        return hash(HashingMethodsEnum.SHA256, `${array.join('|')}`)
    }
}
