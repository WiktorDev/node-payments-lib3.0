export class NHostTransactionEntity {
    id: number
    status: string
    payment_method: string
    payment_status: string
    api_id: string
    amount: number
    payment_description: string
    payment_expiry_at: string
    success_url: string
    cancel_url: string
    created_at: string
    webhook_url: string
}