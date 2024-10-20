// src/routes/betOnEventRoutes.ts
import express, { Request, Response, Router } from 'express';
import { betOnEvent } from '../services/betOnEvent';

const router: Router = express.Router();

const handleBetOnEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, eventId, betAmount } = req.body;

        // Verificação de dados obrigatórios
        if (!email || !eventId || !betAmount) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: email, eventId ou betAmount.' });
            return;
        }

        const message = await betOnEvent(email, eventId, betAmount);
        res.status(201).json({ message });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao realizar a aposta: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao realizar a aposta.' });
        }
    }
};

// Define a rota para apostar em um evento
router.post('/betOnEvent', handleBetOnEvent);

export default router;
