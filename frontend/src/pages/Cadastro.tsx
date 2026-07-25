import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../services/auth";

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
        erroCapturado.response?.data?.mensagem || "Não foi possível cadastrar";
      setErro(mensagem);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Criar conta</h1>
        <p className="text-sm text-gray-400 mb-6">
          Comece a organizar sua faculdade
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}