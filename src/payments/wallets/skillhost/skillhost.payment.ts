import {BasePayment} from "../../../BasePayment";
import {SkillHostParams} from "./skillhost.params";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {validateObject} from "../../../utils/validate.function";
import {PaymentException} from "../../../exceptions/payment.exception";
import {AxiosResponse} from "axios";
import {SkillHostTransactionEntity} from "./entities/skillhost.transaction.entity";
const FormData = require('form-data');

export class SkillHostPayment extends BasePayment {
    private readonly authHeader: string
    private readonly apiUrl: string = "https://api.skillhost.pl/api/v1/payment";
    public params: SkillHostParams;

    constructor(apikey: string, userId: number) {
        super();
        this.authHeader = `${userId} ${apikey}`
        this.params = new SkillHostParams()
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(SkillHostParams, this.params)
        let formData = new FormData();
        Object.keys(this.params).forEach(key => {
            // @ts-ignore
            const field = this.params[key]
            if (!field) return
            formData.append(key, field)
        })
        const response = await this.doRequest(`${this.apiUrl}/createPayment`, "POST", formData, {
            'AUTHORIZATION': this.authHeader,
            'Content-Type': 'application/json',
            ...formData.getHeaders()
        })
        this.handleError(response)
        return new PaymentGeneratedEntity(response.data.data['paymentLink'], response.data.data['id']);
    }

    async getTransactionInfo(transactionId: string): Promise<SkillHostTransactionEntity> {
        const response = await this.doRequest(`${this.apiUrl}/status?transactionId=${transactionId}`, "GET", null, {
            'AUTHORIZATION': this.authHeader,
            'Content-Type': 'application/json'
        })
        this.handleError(response)
        return response.data
    }

    private handleError(response: AxiosResponse): void {
        if (response.status === 200) return
        if (response.data['status'] && response.data['status'] === 'error')
            throw new PaymentException(`[SkillHost] ${response.data['error_type']}`)
    }
}