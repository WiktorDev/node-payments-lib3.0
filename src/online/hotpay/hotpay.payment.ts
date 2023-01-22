import {BasePayment} from "../../BasePayment";
import {HotpayParams} from "./hotpay.params";
import {validateObject} from "../../utils/validate.function";
import * as querystring from "querystring";
import {hash} from "../../utils/crypto.function";
import {HashingMethodsEnum} from "../../enums/HashingMethodsEnum";
import {isJson} from "../../utils/isJson.function";
import {PaymentException} from "../../exceptions/payment.exception";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";

export class HotpayPayment extends BasePayment {
    private secret: string
    private notificationPassword: string
    private apiUrl: string
    params: HotpayParams

    constructor(secret: string, notificationPassword: string, paysafecard: boolean = false) {
        super();
        this.secret = secret;
        this.notificationPassword = notificationPassword;
        this.apiUrl = `https://${paysafecard ? 'psc' : 'platnosc'}.hotpay.pl`
        this.params = new HotpayParams(secret);
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(HotpayParams, this.params)
        this.params.HASH = hash(HashingMethodsEnum.SHA256, `${this.notificationPassword};${this.params.KWOTA};${this.params.NAZWA_USLUGI};${this.params.ADRES_WWW};${this.params.ID_ZAMOWIENIA};${this.secret}`)
        // @ts-ignore
        const response = await this.doRequest(this.apiUrl, 'POST', querystring.stringify(this.params))
        if (!isJson(response.data))
            throw new PaymentException(`[HotPay] invalid notyfication password`)

        if (!response.data['STATUS'])
            throw new PaymentException(`[HotPay] ${response.data['WIADOMOSC']}`)

        return new PaymentGeneratedEntity(response.data['URL'])
    }

    public generateNotificationHash(data: any): string {
        return hash(HashingMethodsEnum.SHA256, [
            this.notificationPassword,
            data['KWOTA'],
            data['ID_PLATNOSCI'],
            data['ID_ZAMOWIENIA'],
            data['STATUS'],
            data['SECURE'],
            data['SEKRET']
        ].join(';'))
    }
}