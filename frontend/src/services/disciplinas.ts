import api from './api';

interface Disciplina {
    id: string;
    nome: string;
    professor: string | null;
    cor: string;
    periodo: string;
    usuarioId: string;
}

interface dadosDisciplina {
    nome?: string;
    professor?: string | null;
    cor?: string;
    periodo?: string;
}

export async function listar(): Promise<Disciplina[]> {
    const resposta = await api.get('/disciplinas');
    return resposta.data;
}

export async function criar(dados: dadosDisciplina): Promise<Disciplina> {
    const resposta = await api.post('/disciplinas', dados);
    return resposta.data;
}

export async function editar(id: string, dados: dadosDisciplina): Promise<Disciplina> {
    const resposta = await api.put(`/disciplinas/${id}`, dados);
    return resposta.data;
}

export async function excluir(id: string): Promise<void> {
    await api.delete(`/disciplinas/${id}`);
}