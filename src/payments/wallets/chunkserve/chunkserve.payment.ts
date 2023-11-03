import {BasePayment} from "../../../BasePayment";
import {ChunkServeParams} from "./chunkserve.params";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {validateObject} from "../../../utils/validate.function";
import {PaymentException} from "../../../exceptions/payment.exception";
import {ChunkServeTransactionEntity} from "./entities/chunkserve.transaction.entity";
import {createHash} from "crypto";
import {hash} from "../../../utils/crypto.function";
import {HashingMethodsEnum} from "../../../enums/HashingMethodsEnum";

export class ChunkServePayment extends BasePayment {
    private readonly apikey: string;
    params: ChunkServeParams
    private readonly apiUrl: string

    constructor(apikey: string) {
        super();
        this.apikey = apikey;
        this.apiUrl = `https://manage.chunkserve.pl`
        this.params = new ChunkServeParams()
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(ChunkServeParams, this.params)
        const response = await this.doRequest(`${this.apiUrl}/api/client/shop/payment/api/create`, "POST", this.params, {
            'Authorization': `Bearer ${this.apikey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        if (response.status != 200) {
            if (response.data.errors[0] != null) throw new PaymentException(`[ChunkServe] ${response.data.errors[0].detail}`)
            throw new PaymentException(`[ChunkServe] ${JSON.stringify(response.data)}`)
        }
        return new PaymentGeneratedEntity(response.data.payment_link, response.data.data.paymentId);
    }

    async getTransactionInfo(transactionId: string): Promise<ChunkServeTransactionEntity> {
        const response = await this.doRequest(`${this.apiUrl}/payment/api/status/${transactionId}`)
        if (response.status != 200) {
            if (response.data.errors[0] != null) throw new PaymentException(`[ChunkServe] ${response.data.errors[0].detail}`)
            throw new PaymentException(`[ChunkServe] ${JSON.stringify(response.data)}`)
        }
        return response.data.data;
    }
    createSignature(transactionId: string, amount: number): string {
        return hash(HashingMethodsEnum.SHA1, `${transactionId}|${amount}|${this.apikey}`)
    }
}