export interface Transaction {
    id: number;
    user_id: number;
    amount: number;
    transaction_type: 'deposito' | 'retirada';
    created_at: Date;
}
