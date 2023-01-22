import {BasePayment} from "../../BasePayment";
import {DpayParams} from "./dpay.params";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";
import {PaymentException} from "../../exceptions/payment.exception";
import {validateObject} from "../../utils/validate.function";
import {hash} from "../../utils/crypto.function";
import {HashingMethodsEnum} from "../../enums/HashingMethodsEnum";
import {DpayTransactionEntity} from "./entities/dpay.transaction.entity";

export class DpayPayment extends BasePayment {
    params: DpayParams
    private paymentUrl: string
    private paymentDetailsUrl: string
    private serviceName: string
    private serviceHash: string

    constructor(serviceName: string, serviceHash: string, sandbox: boolean = false) {
        super();
        this.params = new DpayParams(serviceName)
        this.paymentUrl = `https://secure${sandbox ? '-test' : ''}.dpay.pl/register`
        this.paymentDetailsUrl = `https://panel.${sandbox ? 'digitalpayments' : 'dpay'}.pl/api/v1/pbl/details`
        this.serviceName = serviceName;
        this.serviceHash = serviceHash
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(DpayParams, this.params)
        this.params.checksum = hash(HashingMethodsEnum.SHA256, [
            this.serviceName,
            this.serviceHash,
            this.params.value,
            this.params.url_success,
            this.params.url_fail,
            this.params.url_ipn
        ].join('|'))

        const response = await this.doRequest(this.paymentUrl, 'POST', this.params, {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        })

        if (!response.data['status'] || response.data['error'])
            throw new PaymentException(`[DPay] ${response.data['msg']}`)

        return new PaymentGeneratedEntity(response.data['msg'], response.data['transactionId'])
    }

    async getTransactionInfo(transactionId: string): Promise<DpayTransactionEntity> {
        const response = await this.doRequest(this.paymentDetailsUrl, "POST", {
            service: this.serviceName,
            transaction_id: transactionId,
            checksum: hash(HashingMethodsEnum.SHA256, `${this.serviceName}|${transactionId}|${this.serviceHash}`)
        }, {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        })

        if (response.data['status'] === 'error' || response.data['message'])
            throw new PaymentException(`[DPay] ${response.data['message'] ? response.data['message'] : response.data['0']}`)

        return response.data['transaction']
    }
}