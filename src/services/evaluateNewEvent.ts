// src/services/evaluateNewEvent.ts
import pool from '../db'; // Importando o pool de conexão

export const evaluateNewEvent = async (
    eventId: string,
    moderatorId: string,
    action: 'approve' | 'reject',
    reason?: string
): Promise<string> => {
    try {
        console.log(`Tentando avaliar o evento ${eventId} pelo moderador ${moderatorId}.`);

        // Verifica se o evento existe
        const [eventRows]: any = await pool.execute('SELECT * FROM events WHERE id = ?', [eventId]);
        const eventRow = eventRows[0];

        if (!eventRow) {
            throw new Error('Evento não encontrado.');
        }

        // Verifica se o moderador existe
        const [moderatorRows]: any = await pool.execute('SELECT * FROM users WHERE id = ?', [moderatorId]);
        const moderatorRow = moderatorRows[0];

        if (!moderatorRow) {
            throw new Error('Moderador não encontrado.');
        }

        // Inicia a avaliação do evento
        if (action === 'approve') {
            // Atualiza o status do evento
            await pool.execute('UPDATE events SET status = ? WHERE id = ?', ['approved', eventId]);

            // Insere a avaliação na tabela event_evaluations
            await pool.execute(
                'INSERT INTO event_evaluations (event_id, moderator_id, action) VALUES (?, ?, ?)',
                [eventId, moderatorId, action]
            );

            return 'Evento aprovado com sucesso.';
        } else if (action === 'reject') {
            // Atualiza o status do evento e insere a razão de rejeição
            await pool.execute('UPDATE events SET status = ? WHERE id = ?', ['rejected', eventId]);

            // Insere a avaliação na tabela event_evaluations
            await pool.execute(
                'INSERT INTO event_evaluations (event_id, moderator_id, action, reason) VALUES (?, ?, ?, ?)',
                [eventId, moderatorId, action, reason] 
            );

            return 'Evento rejeitado com sucesso.';
        } else {
            throw new Error('Ação não reconhecida.');
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Log da mensagem de erro
            throw new Error(`Erro ao avaliar o evento: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao avaliar o evento.');
        }
    }
};
