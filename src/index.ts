import express from 'express';
//PARTE 1
import signUpRoutes from './routes/signUpRoutes'; 
import loginRoutes from './routes/loginRoutes';
import addNewEventRoutes from './routes/addNewEventRoutes';
import deleteEventRoutes from './routes/deleteEventRoutes';
import evaluateNewEventRoutes from './routes/evaluateNewEventRoutes'; // Importa as rotas de avaliação
//PARTE 2
import withdrawRoutes from './routes/withdrawRoutes';
import addFundsRoutes from './routes/addFundsRoutes';
import finishEventRoutes from './routes/finishEventRoutes'

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Registrar as rotas
app.use('/api', signUpRoutes); // Adiciona as rotas de signup
app.use('/api', loginRoutes);
app.use('/api', addNewEventRoutes);
app.use('/api', deleteEventRoutes);
app.use('/api', evaluateNewEventRoutes); // Adiciona as rotas de avaliação
app.use('/api', addFundsRoutes);
app.use('/api', withdrawRoutes);
app.use('/api', finishEventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
