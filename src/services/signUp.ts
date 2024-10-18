import pool from '../db'; // Importando a conexão com o banco de dados
import { User } from '../models/signUp';

export const createUser = async (user: User): Promise<void> => {
    try {
        // Verifica se os campos obrigatórios estão presentes
        if (!user.username || !user.email || !user.password) {
            throw new Error('Campos obrigatórios faltando.');
        }

        // Verificação se o e-mail já existe
        const [rows]: any = await pool.execute('SELECT COUNT(*) AS count FROM users WHERE email = ?', [user.email]);
        const count = rows[0]?.count || 0;

        if (count > 0) {
            throw new Error('E-mail já cadastrado');
        }

        // Tratamento do campo `date_of_birth`
        const dateOfBirth = user.date_of_birth ? user.date_of_birth : null;

        // Inserção do novo usuário com todos os parâmetros definidos corretamente
        await pool.execute(
            `INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)`,
            [user.username, user.email, user.password, dateOfBirth]
        );

        console.log(`Usuário ${user.username} criado com sucesso.`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido ao criar usuário.');
        }
    }
};
