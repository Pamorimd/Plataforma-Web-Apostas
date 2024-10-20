// src/routes/eventRoutes.ts
import express, { Request, Response, Router } from 'express';
import { searchEvents } from '../services/searchEvent';

const router: Router = express.Router();

const handleSearchEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            res.status(400).json({ error: 'Palavra-chave é obrigatória para busca.' });
            return;
        }

        const events = await searchEvents(keyword as string);
        res.status(200).json(events);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao buscar eventos: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao buscar eventos.' });
        }
    }
};

// Define a rota para busca de eventos
router.get('/searchEvent', handleSearchEvent);

export default router;
