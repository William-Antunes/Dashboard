import { useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as provasService from "../services/provas";
import Icone from "../components/Icone";

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
      setErro("Não foi possível criar a prova. Confira o nome e a data.");
    }
  }

  return (
    <div className="max-w-md">
      <Link
        to={`/disciplinas/${id}`}
        className="botao-texto mb-6 inline-flex items-center gap-1.5"
      >
        <Icone nome="voltar" tamanho={16} />
        Voltar para a disciplina
      </Link>

      <h1 className="titulo-pagina mb-8">Nova prova</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="nome" className="rotulo">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            placeholder="P1"
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="data" className="rotulo">Data</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
            className="campo"
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <div className="mt-2 flex gap-2">
          <button type="submit" className="botao botao-primario">
            Criar prova
          </button>
          <Link to={`/disciplinas/${id}`} className="botao botao-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
