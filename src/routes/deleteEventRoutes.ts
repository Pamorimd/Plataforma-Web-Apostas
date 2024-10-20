import express, { Request, Response, Router } from 'express';
import { deleteEvent } from '../services/deleteEvent';

const router: Router = express.Router();

const handleDeleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId, userId } = req.body;

        // Verificação de dados obrigatórios
        if (!eventId || !userId) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId ou userId.' });
            return;
        }

        const message = await deleteEvent(eventId, userId);
        res.status(200).json({ message });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao remover o evento: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao remover o evento.' });
        }
    }
};

// Define a rota para remover um evento
router.post('/deleteEvent', handleDeleteEvent);

export default router;
