import {PaymentGeneratedEntity} from "./entities/paymentGenerated.entity";

export interface Payment {
  genratePayment(): Promise<PaymentGeneratedEntity>
}
