export interface Event {
    name: string;
    description: string;
    date: string; // Formato da data como 'YYYY-MM-DD'
    createdBy: number; // ID do usuário que criou o evento
}
