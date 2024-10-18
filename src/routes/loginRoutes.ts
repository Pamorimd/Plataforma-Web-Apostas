import { Router } from 'express';
import { loginUser } from '../services/login';
import { Login } from '../models/login'; // Importando o modelo de Login

const router = Router();

router.post('/login', async (req, res) => {
    const loginData: Login = req.body;

    try {
        const { token } = await loginUser(loginData);
        res.status(200).json({ token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Erro ao fazer login: ' + error.message });
        } else {
            res.status(500).json({ message: 'Erro desconhecido ao fazer login.' });
        }
    }
});

export default router;
