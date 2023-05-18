import {BasePayment} from "../../../BasePayment";
import {Przelewy24Params} from "./przelewy24.params";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";
import {PaymentException} from "../../../exceptions/payment.exception";
import * as querystring from "querystring";
import {Przelewy24PaymentChannelsEntity} from "./entities/przelewy24.paymentChannels.entity";

export class Przelewy24Payment extends BasePayment {
    private readonly merchantId: number
    private readonly posId: number
    private readonly crc: string
    private readonly raportKey: string
    private readonly apiUrl: string
    private readonly paymentPageUrl: string
    public params: Przelewy24Params

    constructor(merchantId: number, posId: number, crc: string, raportKey: string, sandboxMode: boolean = false) {
        super();
        this.params = new Przelewy24Params(merchantId, posId);
        this.merchantId = merchantId
        this.posId = posId
        this.crc = crc;
        this.raportKey = raportKey;
        this.apiUrl = `https://${sandboxMode ? 'sandbox' : 'secure'}.przelewy24.pl/api/v1/transaction`
        this.paymentPageUrl = `https://${sandboxMode ? 'sandbox' : 'secure'}.przelewy24.pl/trnRequest`
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        this.params.sign = hash(HashingMethodsEnum.SHA384, JSON.stringify({
            sessionId: this.params.sessionId,
            merchantId: this.merchantId,
            amount: this.params.amount,
            currency: this.params.currency,
            crc: this.crc
        }))

        const response = await this.doRequest(`${this.apiUrl}/register`, 'POST', this.params, null, {
            username: this.posId.toString(),
            password: this.raportKey
        })

        if (response.status !== 200)
            throw new PaymentException(`[Przelewy24]: ${response.data.error}`)

        const token = response.data.data['token']
        return new PaymentGeneratedEntity(`${this.paymentPageUrl}/${token}`, token)
    }

    async verifyTransaction(payload: any){
        const data = {
            merchantId: this.merchantId,
            posId: this.posId,
            sessionId: payload['sessionId'],
            amount: payload['amount'],
            currency: payload['currency'],
            orderId: payload['orderId'],
            sign: hash(HashingMethodsEnum.SHA384, JSON.stringify({
                sessionId: payload['sessionId'],
                orderId: payload['orderId'],
                amount: payload['amount'],
                currency: payload['currency'],
                crc: this.crc
            }))
        }

        const response = await this.doRequest(`${this.apiUrl}/verify`, "PUT", querystring.stringify(data), null, {
            username: this.posId.toString(),
            password: this.raportKey
        })

        if (response.status !== 200)
            throw new PaymentException(`[Przelewy24]: ${response.data.error}`)

        return response.data
    }

    async getPaymentMethods(lang: string = 'pl'): Promise<Przelewy24PaymentChannelsEntity[]>{
        const response = await this.doRequest(this.apiUrl.replace('transaction', `payment/methods/${lang}`), "GET", null, null, {
            username: this.posId.toString(),
            password: this.raportKey
        })
        return response.data.data
    }
}
