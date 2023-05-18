import {BasePayment} from "../../../../BasePayment";
import {PaymentGeneratedEntity} from "../../../../entities/paymentGenerated.entity";
import {validateObject} from "../../../../utils/validate.function";
import {DpayDirectbillingParams} from "./dpay.directbilling.params";
import {hash} from "../../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../../enums/HashingMethodsEnum";
import {DpayParams} from "../dpay.params";
import {PaymentException} from "../../../../exceptions/payment.exception";

export class DpayDirectbillingPayment extends BasePayment {
    private guid: string;
    private secretKey: string;
    params: DpayDirectbillingParams

    constructor(guid: string, secretKey: string) {
        super();
        this.guid = guid;
        this.secretKey = secretKey
        this.params = new DpayDirectbillingParams()
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(DpayDirectbillingParams, this.params)
        this.params.checksum = hash(HashingMethodsEnum.SHA256, [
            this.guid, this.secretKey, this.params.value, this.params.url_success, this.params.url_fail
        ].join('|'))

        const response = await this.doRequest('https://secure.dpay.pl/dcb/register', "POST", this.params)

        if (!response.data['status'] || response.data['error'])
            throw new PaymentException(`[DPay] ${response.data['msg']}`)

        return new PaymentGeneratedEntity(response.data['msg'], response.data['msg'].replace('https://secure.dpay.pl/pay/?method=dcb&id=', ''))
    }
}