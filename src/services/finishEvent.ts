import pool from '../db';

export interface FinishEventDetails {
    eventId: number;
    result: number;
    moderatorId: number;
}

export const finishEvent = async ({ eventId, result, moderatorId }: FinishEventDetails): Promise<string> => {
    try {
        console.log(`Tentando finalizar o evento ${eventId} com resultado: ${result}.`);

        // Verifica se o usuário é moderador
        const [moderatorRows]: any = await pool.execute('SELECT is_moderator FROM users WHERE id = ?', [moderatorId]);
        const moderator = moderatorRows[0];

        if (!moderator || !moderator.is_moderator) {
            throw new Error('Acesso negado. Apenas moderadores podem encerrar eventos.');
        }

        // Verifica o status atual do evento
        const [eventRows]: any = await pool.execute('SELECT status FROM events WHERE id = ?', [eventId]);
        const event = eventRows[0];

        if (!event) {
            throw new Error('Evento não encontrado.');
        }

        if (event.status === 'finalizado') {
            return 'O evento já foi finalizado.'; // Retorna mensagem sem lançar erro
        }

        // Atualiza o status do evento para 'finalizado'
        await pool.execute('UPDATE events SET status = "finalizado" WHERE id = ?', [eventId]);

        // Calcula o total apostado pelos vencedores
        const [totalVencedores]: any = await pool.execute('SELECT SUM(amount) AS total_vencedores FROM bets WHERE event_id = ? AND won = TRUE', [eventId]);

        // Se não houver vencedores, apenas finalize o evento e retorne uma mensagem
        if (totalVencedores[0].total_vencedores === null) {
            return 'Evento finalizado, mas não há vencedores para distribuir os fundos.'; // Mensagem apropriada
        }

        // Atualiza as carteiras dos vencedores proporcionalmente
        await pool.execute(`
            UPDATE wallets w
            JOIN bets b ON w.user_id = b.user_id
            SET w.balance = w.balance + (b.amount / ?) * ?
            WHERE b.event_id = ? AND b.won = TRUE
        `, [totalVencedores[0].total_vencedores, result, eventId]);

        // Registra as transações para cada vencedor
        await pool.execute(`
            INSERT INTO transactions (user_id, amount, transaction_type)
            SELECT user_id, (amount / ?) * ?, 'depósito'
            FROM bets WHERE event_id = ? AND won = TRUE
        `, [totalVencedores[0].total_vencedores, result, eventId]);

        return 'Evento finalizado e fundos distribuídos com sucesso.';
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao finalizar evento:', error.message);
            throw new Error(`Erro ao finalizar evento: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao finalizar evento.');
        }
    }
};
