import express, { Request, Response, Router } from 'express';
import { addNewEvent } from '../services/addNewEvent';

const router: Router = express.Router();

const handleAddNewEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, date, description, createdBy } = req.body;

        // Verificação de dados obrigatórios
        if (!name || !date || !createdBy) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: name, date ou createdBy.' });
            return;
        }

        // Chama a função para adicionar um novo evento e obter o ID do evento criado
        const { message, eventId } = await addNewEvent({ name, date, description, createdBy });
        res.status(201).json({ message, eventId });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao adicionar o evento: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao adicionar o evento.' });
        }
    }
};

// Define a rota para adicionar um novo evento
router.post('/addNewEvent', handleAddNewEvent);

export default router;
