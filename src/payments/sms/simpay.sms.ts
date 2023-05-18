import {BasePayment} from "../../BasePayment";
import {InvalidSmsCodeException} from "../../exceptions/invalidSmsCode.exception";
import {PaymentException} from "../../exceptions/payment.exception";
import {UsedSmsCodeException} from "../../exceptions/usedSmsCode.exception";

export class SimpaySms extends BasePayment {
    private readonly apiKey: string
    private readonly apiPassword: string

    constructor(apiKey: string, apiPassword: string) {
        super();
        this.apiKey = apiKey
        this.apiPassword = apiPassword
    }

    public async check(serviceId: number, number: number, code: string): Promise<boolean> {
        const response = await this.doRequest(`https://api.simpay.pl/sms/${serviceId}`, 'POST', {
            code: code,
            number: number
        }, {
            'X-SIM-KEY': this.apiKey,
            'X-SIM-PASSWORD': this.apiPassword
        })
        if (response.status === 404)
            throw new InvalidSmsCodeException()

        if (!response.data.success)
            throw new PaymentException(`SimPay error: ${response.data.message}`)

        if (response.data.data.used)
            throw new UsedSmsCodeException()

        return true
    }
}
