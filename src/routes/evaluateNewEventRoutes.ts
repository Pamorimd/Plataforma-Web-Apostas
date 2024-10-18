import express, { Request, Response, Router } from 'express';
import { evaluateNewEvent } from '../services/evaluateNewEvent';

const router: Router = express.Router();

const handleEvaluateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId, moderatorId, action, reason } = req.body;

        // Verificação de dados obrigatórios
        if (!eventId || !moderatorId || !action) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: eventId, moderatorId, ou action.' });
            return;
        }

        // Validação para garantir que a ação seja válida
        const validActions = ['approve', 'reject'];
        if (!validActions.includes(action)) {
            res.status(400).json({ error: 'Ação inválida. Use "approve" ou "reject".' });
            return;
        }

        // Verificação se a razão foi fornecida para a rejeição
        if (action === 'reject' && !reason) {
            res.status(400).json({ error: 'Uma razão deve ser fornecida ao rejeitar um evento.' });
            return;
        }

        const message = await evaluateNewEvent(eventId, moderatorId, action, reason);
        res.status(200).json({ message });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao avaliar o evento: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao avaliar o evento.' });
        }
    }
};

router.post('/evaluate', handleEvaluateEvent);

export default router;
