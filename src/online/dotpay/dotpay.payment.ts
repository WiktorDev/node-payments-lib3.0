import {BasePayment} from "../../BasePayment";
import {DotpayParams} from "./dotpay.params";
import {validateObject} from "../../utils/validate.function";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";
import {objectToQueryString} from "../../utils/objectToQueryString.function";
import {hash, hmac} from "../../utils/crypto.function";
import {HashingMethodsEnum} from "../../enums/HashingMethodsEnum";
import {DotpayUrlcEntity} from "./entities/dotpayUrlc.entity";

export class DotpayPayment extends BasePayment {
    public params: DotpayParams
    private readonly apiUrl: string;
    private readonly pin: string;

    constructor(shopId: number, pin: string, sandbox: boolean = false) {
        super();
        this.params = new DotpayParams(shopId)
        this.apiUrl = `https://ssl.dotpay.pl/${sandbox ? 'test_payment' : 't2'}/`
        this.pin = pin
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity>{
        await validateObject(DotpayParams, this.params)
        this.params.chk = this.generateChk(this.params)
        return new PaymentGeneratedEntity(`${this.apiUrl}?${objectToQueryString(this.params)}`)
    }

    public generateUrlcSignature(payload: DotpayUrlcEntity){
        // @ts-ignore
        delete payload['signature']
        return hash(HashingMethodsEnum.SHA256, `${this.pin}${Object.values(payload).join('')}`)
    }

    private generateChk(object: any): string{
        const keys = Object.keys(object)
        // @ts-ignore
        object = keys.sort().reduce((item, key) => (item[key] = object[key].toString(), item), {})
        object['paramsList'] = keys.join(';')

        return hmac(HashingMethodsEnum.SHA256, JSON.stringify(object), this.pin)
    }
}
