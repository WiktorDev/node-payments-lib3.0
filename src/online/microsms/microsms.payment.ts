import {BasePayment} from "../../BasePayment";
import {HashingMethodsEnum} from "../../enums/HashingMethodsEnum";
import {MicrosmsParams} from "./microsms.params";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";
import {objectToQueryString} from "../../utils/objectToQueryString.function";
import {PaymentException} from "../../exceptions/payment.exception";
import {hash} from "../../utils/crypto.function";
import axios from "axios";

export class MicrosmsPayment extends BasePayment {
    private static API_BASE_URL: string = "https://microsms.pl/api/bankTransfer/";

    private serviceId: number;
    private userId: number;
    private hash: string;
    private hashingMethod: HashingMethodsEnum
    public params: MicrosmsParams

    constructor(serviceId: number, userId: number, hash: string, hashingMethod: HashingMethodsEnum) {
        super();
        this.serviceId = serviceId;
        this.userId = userId;
        this.hash = hash;
        this.hashingMethod = hashingMethod;
        this.params = new MicrosmsParams(serviceId);
    }

    async generatePayment(): Promise<PaymentGeneratedEntity> {
        if(!this.params.amount){
            throw new PaymentException("amount can't be null!")
        }
        this.params.signature = hash(this.hashingMethod, `${this.serviceId}${this.hash}${this.params.amount}`)
        console.log(objectToQueryString(this.params))
        const paymentUrl = `${MicrosmsPayment.API_BASE_URL}?${objectToQueryString(this.params)}`
        const microsmsResponse = await this.doRequest(paymentUrl)
        if (microsmsResponse && microsmsResponse.data){
            throw new PaymentException(`[MicroSMS] ${microsmsResponse.data}`)
        }
        return new PaymentGeneratedEntity(`${MicrosmsPayment.API_BASE_URL}?${objectToQueryString(this.params)}`);
    }
}