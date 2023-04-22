import {BasePayment} from "../../BasePayment";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";
import {validateObject} from "../../utils/validate.function";
import {PaymentException} from "../../exceptions/payment.exception";
import {Host2playParams} from "./host2play.params";
import {Host2playTransactionEntity} from "./entities/host2play.transaction.entity";

export type SERVERS = "pl"|"com"|"es"|"se"

export class Host2PlayPayment extends BasePayment {
  private apikey: string;
  params: Host2playParams
  private apiUrl: string

  constructor(apikey: string, server: SERVERS = 'pl') {
	super();
	this.apikey = apikey;
	this.apiUrl = `https://host2play.${server}/api/v1`
	this.params = new Host2playParams()
  }

  async generatePayment(): Promise<PaymentGeneratedEntity> {
	await validateObject(Host2playParams, this.params)
	const response = await this.doRequest(`${this.apiUrl}/payments/create`, "POST", this.params, {
	  'Authorization': `Bearer ${this.apikey}`,
	  'Content-Type': 'application/json'
	})
	if (response.status != 200) throw new PaymentException(`[Host2Play] ${response.data.message}`)
	return new PaymentGeneratedEntity(response.data.data.paymentLink, response.data.data.paymentId);
  }
  async getTransactionInfo(transactionId: string): Promise<Host2playTransactionEntity> {
	const response = await this.doRequest(`${this.apiUrl}/payments/${transactionId}`, "GET", undefined, {
	  'Authorization': `Bearer ${this.apikey}`,
	  'Content-Type': 'application/json'
	})
	if (response.status != 200) throw new PaymentException(`[Host2Play] ${response.data.message}`)
	return response.data.data
  }
  async removeTransaction(transactionId: string) {
	const response = await this.doRequest(`${this.apiUrl}/payments/${transactionId}`, "DELETE", undefined, {
	  'Authorization': `Bearer ${this.apikey}`,
	  'Content-Type': 'application/json'
	})
	if (response.status != 200) throw new PaymentException(`[Host2Play] ${response.data.message}`)
  }
}
