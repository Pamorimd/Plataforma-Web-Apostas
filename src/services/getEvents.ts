// src/services/getEvents.ts
import pool from '../db'; // Importando o pool de conexão

export const getEvents = async (status?: string): Promise<any[]> => {
    try {
        let query = 'SELECT * FROM events';
        const params: any[] = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        console.log(`Executando consulta: ${query} com parâmetros: ${JSON.stringify(params)}`);
        
        const [rows]: any = await pool.execute(query, params);
        
        console.log(`Resultados obtidos: ${JSON.stringify(rows)}`);
        return rows;
    } catch (error: any) {
        throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }
};
