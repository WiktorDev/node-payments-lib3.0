import {BasePayment} from "../../../BasePayment";
import {HotpayMobileParams} from "./hotpay.mobile.params";
import {validateObject} from "../../../utils/validate.function";
import {objectToQueryString} from "../../../utils/objectToQueryString.function";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";

export class HotpayMobilePayment extends BasePayment {
    private readonly apiUrl: string
    public readonly params: HotpayMobileParams;

    constructor(secret: string, premiumrate: boolean = false) {
        super();
        this.params = new HotpayMobileParams(secret)
        this.apiUrl = `https://${premiumrate ? 'premiumrate' : 'directbilling'}.hotpay.pl/`
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity>{
        await validateObject(HotpayMobileParams, this.params)
        return new PaymentGeneratedEntity(`${this.apiUrl}?${objectToQueryString(this.params)}`)
    }

    public generateNotificationPassword(payload: any, notificationPassword: string): string {
        return hash(HashingMethodsEnum.SHA256, [
            notificationPassword,
            payload['KWOTA'],
            payload['ID_PLATNOSCI'],
            payload['ID_ZAMOWIENIA'],
            payload['STATUS'],
            payload['SEKRET']
        ].join(';'))
    }
}