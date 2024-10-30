import pool from '../db'; // Importando o pool de conexão
import { sendMail } from "../mailService"; // Importando o serviço de envio de e-mail

export const evaluateNewEvent = async (
    eventId: string,
    moderatorId: string,
    action: 'approve' | 'reject',
    reason?: string
): Promise<string> => {
    try {
        console.log('Tentando avaliar o evento ${eventId} pelo moderador ${moderatorId}.');

        // Verifica se o evento existe e obtém o organizador
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

        // Obtém o e-mail do organizador do evento
        const [organizerRows]: any = await pool.execute('SELECT email FROM users WHERE id = ?', [eventRow.created_by]);
        const organizerEmail = organizerRows[0]?.email;

        if (!organizerEmail) {
            throw new Error('E-mail do organizador não encontrado.');
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
        }
            else if (action === 'reject') {
                // Atualiza o status do evento e insere a razão de rejeição
                await pool.execute('UPDATE events SET status = ? WHERE id = ?', ['rejected', eventId]);
            
                // Insere a avaliação na tabela event_evaluations
                await pool.execute(
                    'INSERT INTO event_evaluations (event_id, moderator_id, action, reason) VALUES (?, ?, ?, ?)',
                    [eventId, moderatorId, action, reason] 
                );
            
                // Envio de e-mail para o criador do evento
                const eventCreatorId = eventRow.created_by;
                const [creatorRows]: any = await pool.execute('SELECT email FROM users WHERE id = ?', [eventCreatorId]);
                const creatorEmail = creatorRows[0]?.email;
            
                if (creatorEmail) {
                    const subject = `Evento Rejeitado: ${eventRow.name}`;
                    const html = `<p>Olá,</p>
                                  <p>Infelizmente, seu evento <strong>${eventRow.name}</strong> foi rejeitado.</p>
                                  <p>Motivo: ${reason}</p`;
                    await sendMail('no-reply@seusite.com', creatorEmail, subject, html);
                    
                }           
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
