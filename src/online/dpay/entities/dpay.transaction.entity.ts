export class DpayTransactionEntity {
    id: string
    value: string
    rate: number
    minimal_fee: number
    permanent_fee: number
    status: string
    payment_method: string
    urls: {
        success: string
        fail: string
        ipn: string
    }
    creation_date: string
    payment_date: string
    settled: boolean
    refunded: boolean
    direct: boolean
}