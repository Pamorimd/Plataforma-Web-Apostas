import pool from '../db'; // Importando o pool de conexão

export const betOnEvent = async (email: string, eventId: number, betAmount: number): Promise<string> => {
    try {
        // Verifica se o apostador existe
        const [userRows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = userRows[0];

        if (!user) {
            throw new Error('Apostador não encontrado.');
        }

        // Verifica se o evento existe e está disponível para apostas
        const [eventRows]: any = await pool.execute('SELECT * FROM events WHERE id = ? AND status = ?', [eventId, 'approved']);
        const event = eventRows[0];

        if (!event) {
            throw new Error('Evento não encontrado ou não está disponível para apostas.');
        }

        // Verifica o saldo do usuário na tabela wallets
        const [walletRows]: any = await pool.execute('SELECT balance FROM wallets WHERE user_id = ?', [user.id]);
        const wallet = walletRows[0];

        if (!wallet || wallet.balance < betAmount) {
            throw new Error('Saldo insuficiente para realizar a aposta.');
        }

        // Registra a aposta
        await pool.execute('INSERT INTO bets (user_id, event_id, amount) VALUES (?, ?, ?)', [user.id, eventId, betAmount]);

        // Atualiza o saldo do apostador
        const newBalance = wallet.balance - betAmount;
        await pool.execute('UPDATE wallets SET balance = ? WHERE user_id = ?', [newBalance, user.id]);

        return 'Aposta realizada com sucesso.';
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao realizar a aposta: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao realizar a aposta.');
        }
    }
};
