import {BasePayment} from "../BasePayment";
import {InvalidSmsCodeException} from "../exceptions/invalidSmsCode.exception";
import {UsedSmsCodeException} from "../exceptions/usedSmsCode.exception";

export class CashbillSms extends BasePayment {
    private readonly token: string
    private smsNumber = 0;

    constructor(token: string) {
        super();
        this.token = token
    }

    public async check(code: string): Promise<boolean> {
        const response = await this.doRequest(`https://sms.cashbill.pl/code/${this.token}/${code}`)

        if (response.data.error)
            throw new InvalidSmsCodeException()
        if (!response.data.active || response.data.activeFrom != null)
            throw new UsedSmsCodeException()

        return true
    }
}
