import express, { Request, Response, Router } from 'express';
import { finishEvent } from '../services/finishEvent';

const router: Router = express.Router();

const handleFinishEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { event_id, result } = req.body;

        // Supondo que o ID do moderador é passado no cabeçalho da requisição
        const moderatorId = Number(req.headers['moderator-id']); // Acesso ao ID do moderador via cabeçalho

        // Verificação de dados obrigatórios
        if (!event_id || typeof event_id !== 'number') {
            res.status(400).json({ error: 'ID do evento inválido.' });
            return; // Garantindo que a função termine aqui
        }
        if (result === undefined || result <= 0) {
            res.status(400).json({ error: 'Resultado inválido.' });
            return; // Garantindo que a função termine aqui
        }
        if (!moderatorId) {
            res.status(400).json({ error: 'ID do moderador é necessário.' });
            return; // Garantindo que a função termine aqui
        }

        const message = await finishEvent({ eventId: event_id, result, moderatorId });
        res.status(200).json({ message });
    } catch (error) {
        const errorMessage = error instanceof Error 
            ? `Erro ao finalizar o evento: ${error.message}` 
            : 'Erro desconhecido ao finalizar o evento.';
        res.status(500).json({ error: errorMessage });
    }
};

router.post('/finish', handleFinishEvent);

export default router;
