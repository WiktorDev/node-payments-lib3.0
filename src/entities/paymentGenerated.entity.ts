export class PaymentGeneratedEntity{
    url: string
    id?: string

    constructor(url: string, id?: string) {
        this.url = url;
        this.id = id;
    }
}