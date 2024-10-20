import pool from '../db'; // Importa a conexão com o banco de dados

export const searchEvents = async (keyword: string): Promise<any[]> => {
    try {
        const [rows]: any = await pool.execute(
            'SELECT * FROM events WHERE name LIKE ?',
            [`%${keyword}%`] // Busca por eventos cujo nome contém a palavra-chave
        );
        return rows;
    } catch (error) {
        // Afirmar que 'error' é do tipo 'Error'
        if (error instanceof Error) {
            throw new Error('Erro ao buscar eventos: ' + error.message);
        } else {
            throw new Error('Erro desconhecido ao buscar eventos.');
        }
    }
};
