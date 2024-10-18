"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawFunds = void 0;
const database_1 = require("../database");
// Função para retirar fundos de um usuário
const withdrawFunds = async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const [result] = await database_1.pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.status(200).json({ message: 'Fundos retirados com sucesso' });
    }
    catch (error) {
        console.error('Erro ao retirar fundos:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.withdrawFunds = withdrawFunds;
