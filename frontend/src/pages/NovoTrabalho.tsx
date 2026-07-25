import { useState, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as trabalhosService from "../services/trabalhos";

export default function NovoTrabalho() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!id) return;

    try {
      await trabalhosService.criar({
        disciplinaId: id,
        titulo,
        descricao,
        dataEntrega,
      });

      navigate(`/disciplinas/${id}`);
    } catch {
      setErro("Não foi possível criar o trabalho");
    }
  }

  return (
    <div>
      <Link to={`/disciplinas/${id}`}>← Voltar</Link>

      <h1>Novo trabalho</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
          />
        </div>

        <div>
          <label>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
          />
        </div>

        <div>
          <label>Data de entrega</label>
          <input
            type="date"
            value={dataEntrega}
            onChange={(evento) => setDataEntrega(evento.target.value)}
          />
        </div>

        {erro && <p>{erro}</p>}

        <button type="submit">Criar trabalho</button>
      </form>
    </div>
  );
}