import api from './api';

interface usuarioRegistrado {
    id: string;
    nome: string;
    email: string;
}

interface loginResposta {
    token: string;
    usuario: usuarioRegistrado;
}

export async function registrar(nome: string, email: string, senha: string): Promise<usuarioRegistrado> {
    const resposta = await api.post("/auth/registrar", { nome, email, senha });
    return resposta.data
}

export async function login(email: string, senha: string): Promise<loginResposta> {
    const resposta = await api.post("/auth/login", { email, senha });
    return resposta.data
}

export async function me(): Promise<usuarioRegistrado> {
  const resposta = await api.get("/auth/me");
  return resposta.data;
}