import express, { Request, Response, Router } from 'express';
import { withdrawFundsWithTax } from '../services/withdrawFunds';

const router: Router = express.Router();

const handleWithdraw = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, amount, bankDetails } = req.body;

        // Verificação de dados obrigatórios
        if (!userId || !amount || !bankDetails) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes: userId, amount, ou bankDetails.' });
            return;
        }

        // Validação para garantir que o valor seja positivo
        if (amount <= 0) {
            res.status(400).json({ error: 'O valor do saque deve ser maior que zero.' });
            return;
        }

        // Validação para garantir que as informações bancárias estejam corretas
        if (!bankDetails.bank_name && !bankDetails.pix_key) {
            res.status(400).json({ error: 'Informe pelo menos um método de recebimento: banco ou chave PIX.' });
            return;
        }

        const message = await withdrawFundsWithTax(userId, amount, bankDetails);
        res.status(200).json({ message });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Erro ao processar o saque: ${error.message}` });
        } else {
            res.status(500).json({ error: 'Erro desconhecido ao processar o saque.' });
        }
    }
};

router.post('/withdraw', handleWithdraw);

export default router;
