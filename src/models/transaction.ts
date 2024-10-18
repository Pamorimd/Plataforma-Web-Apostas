export interface Transaction {
    id: number;
    user_id: number;
    amount: number;
    transaction_type: 'deposit' | 'withdraw';
    created_at: Date;
}
