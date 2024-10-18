import pool from '../db';

export const withdrawFundsWithTax = async (userId: number, amount: number, bankDetails: any): Promise<string> => {
    try {
        console.log(`Tentando sacar R$ ${amount} para o usuário ${userId}.`);

        // Verifica se a carteira do usuário existe
        const [rows]: any = await pool.execute('SELECT * FROM wallets WHERE user_id = ?', [userId]);
        const walletRow = rows[0];

        if (!walletRow) {
            throw new Error('Carteira não encontrada.');
        }

        // Verifica o limite máximo de saque por dia
        if (amount > 101000.00) {
            console.log('Valor do saque excede o limite diário.');
            throw new Error('O valor máximo de saque por dia é de R$ 101.000,00.');
        }

        // Verifica se o saldo é suficiente para o saque
        if (walletRow.balance < amount) {
            throw new Error('Saldo insuficiente.');
        }

        // Calcula a taxa de saque com base no valor
        let taxa = 0;
        if (amount <= 100) {
            taxa = amount * 0.04;
        } else if (amount <= 1000) {
            taxa = amount * 0.03;
        } else if (amount <= 5000) {
            taxa = amount * 0.02;
        } else if (amount <= 100000) {
            taxa = amount * 0.01;
        }

        const totalAmount = amount + taxa;
        if (walletRow.balance < totalAmount) {
            throw new Error('Saldo insuficiente para cobrir o valor do saque e a taxa.');
        }

        const newBalance = walletRow.balance - totalAmount;
        await pool.execute('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, userId]);

        // Atualiza os detalhes bancários na tabela wallets
        await pool.execute('UPDATE wallets SET bank_name = ?, agency_number = ?, account_number = ?, pix_key = ? WHERE user_id = ?', 
        [bankDetails.bank_name, bankDetails.agency_number, bankDetails.account_number, bankDetails.pix_key, userId]);

        // Registra a transação na tabela de transações
        await pool.execute('INSERT INTO transactions (user_id, amount, transaction_type) VALUES (?, ?, ?)', [userId, amount, 'retirada']);

        return `Saque de R$ ${amount} realizado com sucesso. Taxa aplicada: R$ ${taxa}. Saldo atual: R$ ${newBalance}.`;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao processar o saque: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao processar o saque.');
        }
    }
};
