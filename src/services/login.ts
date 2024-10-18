import pool from '../db'; // Importando a conexão com o banco de dados
import { Login } from '../models/login'; // Importando o modelo de Login

export const loginUser = async (loginData: Login): Promise<{ token: string }> => {
    const { email, password } = loginData;

    try {
        // Verifica se o usuário existe
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        // Verifica a senha (sem bcrypt, já que está em texto puro)
        if (user.password !== password) {
            throw new Error('Senha incorreta.');
        }

        // Gera um token aleatório de 32 caracteres
        const token = generateRandomToken();

        // Atualiza o token na tabela 'users'
        await pool.execute('UPDATE users SET token = ? WHERE email = ?', [token, email]);

        return { token };

    } catch (error: unknown) {
        if (error instanceof Error) {
            // Se `error` é um objeto do tipo `Error`, você pode acessar `message`
            throw new Error('Erro: ' + error.message);
        } else {
            // Se não for um objeto `Error`, trate como um erro desconhecido
            throw new Error('Erro desconhecido.');
        }
    }
};

// Função para gerar um token aleatório de 32 caracteres
function generateRandomToken(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}
