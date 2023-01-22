import {BasePayment} from "../../../BasePayment";
import {PaybylinkDirectbillingParams} from "./paybylink.directbilling.params";
import {validateObject} from "../../../utils/validate.function";
import {PaymentException} from "../../../exceptions/payment.exception";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {PaybylinkDirectbillingTransactionEntity} from "./entities/paybylink.directbilling.transaction.entity";

export class PaybylinkDirectbillingPayment extends BasePayment {
    private readonly login: string
    private readonly password: string
    private readonly signatureHash: string
    public readonly params: PaybylinkDirectbillingParams

    constructor(login: string, password: string, hash: string) {
        super();
        this.login = login
        this.password = password
        this.signatureHash = hash
        this.params = new PaybylinkDirectbillingParams()
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity>{
        await validateObject(PaybylinkDirectbillingParams, this.params)
        this.params.price = this.params.price * 100;
        this.params.signature = hash(HashingMethodsEnum.SHA256, `${Object.values(this.params).join('|')}|${this.signatureHash}`);

        const response = await this.doRequest('https://paybylink.pl/direct-biling/', 'POST', this.params, null, {
            username: this.login,
            password: this.password
        })

        if (response && response.data['status'] === 'success') {
            const paymentId = response.data['clientURL'].replace('https://paybylink.pl/direct-biling/', '').replace('/', '')
            return new PaymentGeneratedEntity(response.data['clientURL'], paymentId)
        }
        throw new PaymentException(`[PayByLink] ${response.data['message']}`)
    }

    public async getTransactionInfo(paymentId: string): Promise<PaybylinkDirectbillingTransactionEntity>{
        const response = await this.doRequest('https://paybylink.pl/direct-biling/transactionStatus.php', 'POST', {
            pid: paymentId,
            signature: hash(HashingMethodsEnum.SHA256, `${paymentId}|${this.signatureHash}`)
        }, null, {
            username: this.login,
            password: this.password
        })

        if (response && response.data['status'] === 'error')
            throw new PaymentException(`[PayByLink] (Code: ${response.data['code']}) ${response.data['message']}`)

        return response.data
    }
}
