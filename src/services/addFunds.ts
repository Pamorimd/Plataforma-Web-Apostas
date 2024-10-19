import pool from '../db';

export interface BankDetails {
    bank_name: string;
    agency_number: string;
    account_number: string;
    pix_key: string;
}

export const addFunds = async (userId: number, amount: number, bankDetails: BankDetails): Promise<string> => {
    try {
        console.log(`Tentando adicionar R$ ${amount} à carteira do usuário ${userId}.`);

        // Verifica se a carteira do usuário existe
        const [rows]: any = await pool.execute('SELECT * FROM wallets WHERE user_id = ?', [userId]);
        const walletRow = rows[0];

        if (!walletRow) {
            throw new Error('Carteira não encontrada.');
        }

        // Adiciona o valor à carteira
        const newBalance = walletRow.balance + amount;
        await pool.execute('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, userId]);

        // Atualiza os detalhes bancários na tabela wallets
        await pool.execute('UPDATE wallets SET bank_name = ?, agency_number = ?, account_number = ?, pix_key = ? WHERE user_id = ?', 
        [bankDetails.bank_name, bankDetails.agency_number, bankDetails.account_number, bankDetails.pix_key, userId]);

        // Registra a transação na tabela de transações
        await pool.execute('INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)', [userId, amount, 'depósito']);

        return `Depósito de R$ ${amount} realizado com sucesso. Saldo atual: R$ ${newBalance}.`;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao processar o depósito: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao processar o depósito.');
        }
    }
};
