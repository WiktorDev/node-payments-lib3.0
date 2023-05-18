import {BasePayment} from "../../BasePayment";
import {objectToQueryString} from "../../utils/objectToQueryString.function";
import {PaymentException} from "../../exceptions/payment.exception";
import {InvalidSmsCodeException} from "../../exceptions/invalidSmsCode.exception";
import {UsedSmsCodeException} from "../../exceptions/usedSmsCode.exception";

export class HotpaySms extends BasePayment  {
    private readonly secret: string

    constructor(secret: string) {
        super();
        this.secret = secret
    }

    public async check(code: string): Promise<boolean> {
        const data = {
            sekret: this.secret,
            kod_sms: code
        }
        const response = await this.doRequest(`https://apiv2.hotpay.pl/v1/sms/sprawdz?${objectToQueryString(data)}`)

        if (response.data.status === 'ERROR' && response.data.tresc !== 'BLEDNA TRESC SMS')
            throw new PaymentException(`HotPay error: ${response.data.tresc}`)

        if (response.data.status !== 'SUKCESS')
            throw new InvalidSmsCodeException()

        if (response.data.aktywacja != 1)
            throw new UsedSmsCodeException()

        return true
    }
}
