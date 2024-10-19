export interface Event {
    id: string; // ou number, dependendo do tipo do ID no seu banco de dados
    name: string;
    date: Date; // ou string, dependendo do formato da data que você está usando
    status: 'pending' | 'approved' | 'rejected' | 'finalizado'; // Inclui o novo status
    rejection_reason?: string; // opcional, para armazenar a razão da rejeição
}
