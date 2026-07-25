import { useState, FormEvent } from "react";
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
    <div>
      <Link to={`/disciplinas/${id}`}>← Voltar</Link>

      <h1>Nova prova</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />
        </div>

        <div>
          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
          />
        </div>

        {erro && <p>{erro}</p>}

        <button type="submit">Criar prova</button>
      </form>
    </div>
  );
}