import express from 'express';
import signUpRoutes from './routes/signUpRoutes'; 
import loginRoutes from './routes/loginRoutes';
import evaluateNewEventRoutes from './routes/evaluateNewEventRoutes'; // Importa as rotas de avaliação
import withdrawRoutes from './routes/withdrawRoutes';

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use('/api', signUpRoutes); // Adiciona as rotas de signup
app.use('/api', loginRoutes);
app.use('/api', evaluateNewEventRoutes); // Adiciona as rotas de avaliação
app.use('/api', withdrawRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
