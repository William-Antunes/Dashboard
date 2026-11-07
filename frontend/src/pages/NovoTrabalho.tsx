import { useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as trabalhosService from "../services/trabalhos";
import Icone from "../components/Icone";

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
      setErro("Não foi possível criar o trabalho. Confira o título e a data de entrega.");
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

      <h1 className="titulo-pagina mb-8">Novo trabalho</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="titulo" className="rotulo">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            placeholder="Relatório do laboratório 3"
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="descricao" className="rotulo">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="entrega" className="rotulo">Data de entrega</label>
          <input
            id="entrega"
            type="date"
            value={dataEntrega}
            onChange={(evento) => setDataEntrega(evento.target.value)}
            className="campo"
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <div className="mt-2 flex gap-2">
          <button type="submit" className="botao botao-primario">
            Criar trabalho
          </button>
          <Link to={`/disciplinas/${id}`} className="botao botao-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
