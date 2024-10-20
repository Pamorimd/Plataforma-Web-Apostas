import pool from '../db'; // Importando a conexão com o banco de dados
import { Event } from '../models/addEvent'; // Importando o modelo de Event

export const addNewEvent = async (eventData: Event): Promise<{ message: string; eventId: number }> => {
    const { name, description, date, createdBy } = eventData;

    try {
        // Insere um novo evento na tabela 'events'
        const [result]: any = await pool.execute(
            'INSERT INTO events (name, description, date, created_by, status) VALUES (?, ?, ?, ?, ?)',
            [name, description, date, createdBy, 'pending']
        );

        const eventId = result.insertId; // ID do evento recém-criado

        return { message: 'Evento criado com sucesso e aguardando aprovação.', eventId };

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Erro ao criar o evento: ' + error.message);
        } else {
            // Se não for um objeto `Error`, trate como um erro desconhecido
            throw new Error('Erro desconhecido ao criar o evento.');
        }
    }
};
