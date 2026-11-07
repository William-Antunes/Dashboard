import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import TelaAcesso from "../components/TelaAcesso";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    try {
      await login(email, senha);
      navigate("/");
    } catch {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <TelaAcesso
      titulo="Entrar"
      descricao="Seus prazos, provas e faltas em um só lugar."
      rodape={
        <>
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro" className="link">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            className="campo"
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="botao botao-primario mt-2 w-full">
          Entrar
        </button>
      </form>
    </TelaAcesso>
  );
}
