import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/auth";
import TelaAcesso from "../components/TelaAcesso";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    try {
      await authService.registrar(nome, email, senha);
      navigate("/login");
    } catch (erroCapturado: any) {
      const mensagem =
        erroCapturado.response?.data?.mensagem || "Não foi possível criar a conta";
      setErro(mensagem);
    }
  }

  return (
    <TelaAcesso
      titulo="Criar conta"
      descricao="Organize as matérias do período em poucos minutos."
      rodape={
        <>
          Já tem uma conta?{" "}
          <Link to="/login" className="link">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="nome" className="rotulo">Nome</label>
          <input
            id="nome"
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="email" className="rotulo">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="senha" className="rotulo">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            className="campo"
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="botao botao-primario mt-2 w-full">
          Criar conta
        </button>
      </form>
    </TelaAcesso>
  );
}
