import {BasePayment} from "../../BasePayment";
import {objectToQueryString} from "../../utils/objectToQueryString.function";
import {PaymentException} from "../../exceptions/payment.exception";
import {InvalidSmsCodeException} from "../../exceptions/invalidSmsCode.exception";
import {UsedSmsCodeException} from "../../exceptions/usedSmsCode.exception";

export class PaybylinkSms extends BasePayment {
    private readonly userId: number;
    private readonly serviceId: number;

    constructor(userId: number, serviceId: number) {
        super();
        this.userId = userId;
        this.serviceId = serviceId;
    }

    public async check(code: string, number: number): Promise<boolean> {
        const data = {
            userid: this.userId,
            code: code,
            serviceid: this.serviceId,
            number: number
        }
        const response = await (await this.doRequest(`https://paybylink.pl/api/v2/index.php?${objectToQueryString(data)}`)).data

        if (!response.connect && response.data.errorCode !== 1)
            throw new PaymentException(`MicroSMS error ${response.data.errorCode}: ${response.data.message}`)

        if (response.data.errorCode && response.data.errorCode === 1)
            throw new InvalidSmsCodeException()

        if (response.data.status !== 1)
            throw new UsedSmsCodeException()

        return true
    }
}
