import express from 'express';
import withdrawRoutes from './routes/withdrawRoutes';
import evaluateNewEventRoutes from './routes/evaluateNewEventRoutes'; // Importa as rotas de avaliação
import signUpRoutes from './routes/signUpRoutes'; // Importa as rotas de signup

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use('/api', withdrawRoutes);
app.use('/api', evaluateNewEventRoutes); // Adiciona as rotas de avaliação
app.use('/api', signUpRoutes); // Adiciona as rotas de signup

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
