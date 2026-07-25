import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";
import * as provasService from "../services/provas";

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  cor: string;
  periodo: string | null;
}

interface Trabalho {
  id: string;
  titulo: string;
  descricao: string | null;
  dataEntrega: string;
  status: string;
  disciplinaId: string;
}

interface Prova {
  id: string;
  nome: string;
  data: string;
  disciplinaId: string;
}

export default function DisciplinaDetalhes() {
  const { id } = useParams<{ id: string }>();

  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    if (!id) return;

    setCarregando(true);
    setErro("");

    try {
      const [todasDisciplinas, dadosTrabalhos, dadosProvas] = await Promise.all([
        disciplinasService.listar(),
        trabalhosService.listar(id),
        provasService.listar(id),
      ]);

      const disciplinaEncontrada = todasDisciplinas.find((d) => d.id === id);

      if (!disciplinaEncontrada) {
        setErro("Disciplina não encontrada");
        return;
      }

      setDisciplina(disciplinaEncontrada);
      setTrabalhos(dadosTrabalhos);
      setProvas(dadosProvas);
    } catch {
      setErro("Não foi possível carregar os dados da disciplina");
    } finally {
      setCarregando(false);
    }
  }

  async function handleConcluir(trabalhoId: string) {
    try {
      await trabalhosService.concluir(trabalhoId);
      carregarDados();
    } catch {
      setErro("Não foi possível concluir o trabalho");
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return (
      <div>
        <p>{erro}</p>
        <Link to="/disciplinas">Voltar para Disciplinas</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/disciplinas">← Voltar para Disciplinas</Link>

      <h1>{disciplina?.nome}</h1>
      <p>Professor: {disciplina?.professor || "Não informado"}</p>
      <p>Período: {disciplina?.periodo || "Não informado"}</p>

      <section>
        <h2>Trabalhos</h2>
        <Link to={`/disciplinas/${id}/trabalhos/novo`}>+ Novo trabalho</Link>

        {trabalhos.length === 0 && <p>Nenhum trabalho cadastrado.</p>}
        <ul>
          {trabalhos.map((trabalho) => (
            <li key={trabalho.id}>
              {trabalho.titulo} — {trabalho.status} — entrega:{" "}
              {new Date(trabalho.dataEntrega).toLocaleDateString()}
              {trabalho.status === "pendente" && (
                <button onClick={() => handleConcluir(trabalho.id)}>
                  Concluir
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Provas</h2>
        <Link to={`/disciplinas/${id}/provas/novo`}>+ Nova prova</Link>

        {provas.length === 0 && <p>Nenhuma prova cadastrada.</p>}
        <ul>
          {provas.map((prova) => (
            <li key={prova.id}>
              {prova.nome} — {new Date(prova.data).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}