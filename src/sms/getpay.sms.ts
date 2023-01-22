import {BasePayment} from "../BasePayment";
import {PaymentException} from "../exceptions/payment.exception";
import {InvalidSmsCodeException} from "../exceptions/invalidSmsCode.exception";
import {UsedSmsCodeException} from "../exceptions/usedSmsCode.exception";

export class GetpaySms extends BasePayment {
    private readonly apiKey: string
    private readonly apiSecret: string
    private responseCode: number = 0;
    private responseCodes: any = {
        100: 'Empty method',
        102: 'Empty params',
        104: 'Wrong length of client API login data (key/secret)',
        105: 'Wrong client API login data (key/secret)',
        106: 'Wrong client status',
        107: 'No method require params',
        200: 'OK',
        400: 'SMS code not found',
        401: 'SMS code already used',
        402: 'System error'
    }

    constructor(apiKey: string, apiSecret: string) {
        super();
        this.apiKey = apiKey
        this.apiSecret = apiSecret
    }

    // @ts-ignore
    public async check(code: string, number: number, unlimited?: boolean = false): Promise<boolean> {
        const response = await this.doRequest('https://getpay.pl/panel/app/common/resource/ApiResource.php', "POST", {
            apiKey: this.apiKey,
            apiSecret: this.apiSecret,
            number: number,
            code: code,
            unlimited: unlimited
        })
        this.responseCode = response.data.infoCode

        if ([200, 400, 401].includes(this.responseCode))
            throw new PaymentException(`GetPay error ${this.responseCode}: ${this.responseCodes[this.responseCode]}`)
        if (this.responseCode === 400)
            throw new InvalidSmsCodeException()
        if (this.responseCode === 401)
            throw new UsedSmsCodeException()

        return true
    }
}
