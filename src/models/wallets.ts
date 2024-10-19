export interface Wallet {
    id: number;
    user_id: number;
    balance: number;
    bank_name?: string;
    agency_number?: string;
    account_number?: string;
    pix_key?: string;
  }