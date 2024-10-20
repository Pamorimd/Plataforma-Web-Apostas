// src/routes/eventRoutes.ts
import express, { Request, Response, Router } from 'express';
import { getEvents } from '../services/getEvents';

const router: Router = express.Router();

const handleGetEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.query; // Obtemos o status da query string

        // Limpa o status para remover espaços em branco e caracteres de nova linha
        const cleanedStatus = status ? (status as string).trim() : undefined;

        console.log(`Buscando eventos com status: ${cleanedStatus}`); // Log para depuração

        // Chama a função para buscar eventos
        const events = await getEvents(cleanedStatus);
        
        console.log(`Eventos encontrados: ${JSON.stringify(events)}`); // Log para depuração
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
router.get('/getEvents', handleGetEvents);

export default router;
