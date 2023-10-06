import {BasePayment} from "../../../BasePayment";
import {NHostParams} from "./nhost.params";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {validateObject} from "../../../utils/validate.function";
import {isJson} from "../../../utils/isJson.function";
import {PaymentException} from "../../../exceptions/payment.exception";
import {NHostTransactionEntity} from "./entities/nhost.transaction.entity";

export class NHostPayment extends BasePayment {
    private readonly apikey: string;
    params: NHostParams

    constructor(apikey: string) {
        super();
        this.apikey = apikey
        this.params = new NHostParams()
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(NHostParams, this.params)
        const response = await this.doRequest("https://panel.nhost.pl/api/payments/create", "POST", this.params, {
            'access-token': this.apikey
        })
        if (response.status !== 200) {
            throw new PaymentException(`[NHost] ${response.data.message}`)
        }
        return new PaymentGeneratedEntity(response.data.transaction_id, response.data.redirect_url)
    }
    async getTransactionInfo(transactionId: string): Promise<NHostTransactionEntity> {
        const response = await this.doRequest(`https://panel.nhost.pl/api/payments?identifier=${transactionId}`, "GET", null, {
            'access-token': this.apikey
        })
        if (response.status !== 200) {
            throw new PaymentException(`[NHost] ${response.data.message}`)
        }
        return response.data.transaction
    }
    async cancelTransaction(transactionId: string): Promise<void> {
        const response = await this.doRequest("https://panel.nhost.pl/api/payments/cancel", "POST", {
            "identifier": transactionId
        }, {
            'access-token': this.apikey
        })
        if (response.status !== 200) {
            throw new PaymentException(`[NHost] ${response.data.message}`)
        }
    }
}