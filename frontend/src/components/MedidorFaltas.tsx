import { limiteFaltas } from "../utils/disciplinas";

// Barra fina mostrando quanto do limite de 25% de faltas já foi usado
export default function MedidorFaltas({
  faltas,
  cargaHoraria,
  largura = "w-24",
}: {
  faltas: number;
  cargaHoraria: number;
  largura?: string;
}) {
  const limite = limiteFaltas(cargaHoraria);
  const proporcao = limite > 0 ? Math.min(faltas / limite, 1) : 0;
  const perigo = limite > 0 && faltas >= limite * 0.75;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`h-1.5 ${largura} overflow-hidden rounded-full bg-realce`}
        role="meter"
        aria-label="Faltas usadas do limite"
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-valuenow={faltas}
      >
        <div
          className={`h-full rounded-full ${perigo ? "bg-urgente" : "bg-lapis/60"}`}
          style={{ width: `${proporcao * 100}%` }}
        />
      </div>
      <span className={`numeros text-xs ${perigo ? "text-urgente" : "text-lapis"}`}>
        {faltas} de {limite} faltas
      </span>
    </div>
  );
}
