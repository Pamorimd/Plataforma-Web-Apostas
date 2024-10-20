// src/services/deleteEvent.ts
import pool from '../db'; // Importando o pool de conexão

export const deleteEvent = async (eventId: number, userId: number): Promise<string> => {
    try {
        // Verifica se o evento existe e está como 'pending'
        const [eventRows]: any = await pool.execute('SELECT * FROM events WHERE id = ? AND created_by = ? AND status = ?', [eventId, userId, 'pending']);
        const eventRow = eventRows[0];

        if (!eventRow) {
            throw new Error('Evento não encontrado ou não pode ser removido (deve estar em status "pending" e ser de sua autoria).');
        }

        // Verifica se existem apostas para este evento
        const [betRows]: any = await pool.execute('SELECT * FROM bets WHERE event_id = ?', [eventId]);

        if (betRows.length > 0) {
            throw new Error('Não é possível remover o evento, pois ele já possui apostas.');
        }

        // Altera o status do evento para 'deleted'
        await pool.execute('UPDATE events SET status = ? WHERE id = ?', ['deleted', eventId]);

        return 'Evento removido com sucesso.';
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao remover o evento: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao remover o evento.');
        }
    }
};
