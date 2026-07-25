import { useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as provasService from "../services/provas";

export default function NovaProva() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!id) return;

    try {
      await provasService.criar({
        disciplinaId: id,
        nome,
        data,
      });

      navigate(`/disciplinas/${id}`);
    } catch {
      setErro("Não foi possível criar a prova");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <Link
        to={`/disciplinas/${id}`}
        className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
      >
        ← Voltar
      </Link>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-white mb-4">Nova prova</h1>

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
            <label className="block text-sm text-gray-300 mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={(evento) => setData(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Criar prova
          </button>
        </form>
      </div>
    </div>
  );
}