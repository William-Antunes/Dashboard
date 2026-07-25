import api from './api';

interface Provas{
    id: string;
    nome: string;
    data: string;
    disciplinaId: string;
}
interface DadosProva{
    disciplinaId: string;
    nome: string;
    data: string;
}

export async function listar(disciplinaId?: string): Promise<Provas[]>{
    const resposta = await api.get('/provas', {
        params: disciplinaId ? { disciplinaId } : {}
    })
    return resposta.data    
}

export async function criar(dados: DadosProva): Promise<Provas>{
    const resposta = await api.post('/provas', dados)
    return resposta.data
}

export async function editar(id: string, dados: DadosProva): Promise<Provas>{
    const resposta = await api.put(`/provas/${id}`, dados)
    return resposta.data
}

export async function excluir(id: string): Promise<void>{
    await api.delete(`/provas/${id}`)
}