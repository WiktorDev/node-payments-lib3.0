import { BasePayment } from "../../../BasePayment";
import { SimpayOnlineParams } from "./simpayOnline.params";
import { validateObject } from "../../../utils/validate.function";
import { hash } from "../../../utils/crypto.function";
import { HashingMethodsEnum } from "../../../enums/HashingMethodsEnum";
import { PaymentException } from "../../../exceptions/payment.exception";
import { PaymentGeneratedEntity } from "../../../entities/paymentGenerated.entity";

export class SimpayOnlinePayment extends BasePayment {
    private readonly serviceId: number;
    private readonly token: string;
    private readonly serviceHash: string;
    public readonly params: SimpayOnlineParams;

    constructor(serviceId: number, token: string, serviceHash: string) {
        super();
        this.serviceId = serviceId;
        this.token = token;
        this.serviceHash = serviceHash;
        this.params = new SimpayOnlineParams();
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(SimpayOnlineParams, this.params);

        const response = await this.doRequest(`https://api.simpay.pl/payment/${this.serviceId}/transactions`, 'POST', this.params, {
            'Authorization': `Bearer ${this.token}`
        });

        if (response && response.status !== 201)
            throw new PaymentException(`[SimPay] ${JSON.stringify(response.data)}`);
        
        return new PaymentGeneratedEntity(response.data['data']['redirectUrl'], response.data['data']['transactionId']);
    }

    public generateNotificationSignature(payload: any): string {
        return hash(HashingMethodsEnum.SHA256, [
            payload.id,
            payload.service_id,
            payload.status,
            payload.amount.value,
            payload.amount.currency,
            payload.amount.commission,
            payload.control,
            payload.channel,
            payload.environment,
            this.serviceHash
        ].join('|'));
    }
}