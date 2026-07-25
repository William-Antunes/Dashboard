import api from './api';

interface Trabalho {
    id: string;
    titulo: string;
    descricao: string | null;
    disciplinaId: string;
    dataEntrega: string;
    status: string;
}
interface DadosTrabalho {
    disciplinaId: string;
    titulo: string
    descricao?: string | null;
    dataEntrega: string;
}

export async function listar(disciplinaId?: string): Promise<Trabalho[]> {
    const resposta = await api.get('/trabalhos', {
        params: disciplinaId ? { disciplinaId } : {}
    });
    return resposta.data;
}

export async function criar(dados: DadosTrabalho): Promise<Trabalho> {
    const resposta = await api.post('/trabalhos', dados);
    return resposta.data;
}

export async function editar(id: string, dados: DadosTrabalho): Promise<Trabalho> {
    const resposta = await api.put(`/trabalhos/${id}`, dados);
    return resposta.data;
}

export async function concluir(id: string): Promise<Trabalho> {
    const resposta = await api.patch(`/trabalhos/${id}/concluir`);
    return resposta.data;
}

export async function excluir(id: string): Promise<void> {
    await api.delete(`/trabalhos/${id}`);
}