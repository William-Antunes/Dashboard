// Ícones em SVG inline, traço de 1.6px, herdando a cor do texto (currentColor)
const CAMINHOS = {
  inicio: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z",
  grade: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14",
  trabalhos: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h4",
  provas: "M5 4h14v16H5zM9 9l2 2 4-4M9 15h6",
  disciplinas: "M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5H13z",
  menu: "M4 7h16M4 12h16M4 17h16",
  fechar: "M6 6l12 12M18 6 6 18",
  anterior: "M15 6l-6 6 6 6",
  proximo: "M9 6l6 6-6 6",
  voltar: "M19 12H5M11 6l-6 6 6 6",
  mais: "M12 5v14M5 12h14",
  check: "M5 12.5 10 17l9-10",
  sol: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  lua: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  sair: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10",
};

export type NomeIcone = keyof typeof CAMINHOS;

export default function Icone({
  nome,
  tamanho = 18,
  className = "",
}: {
  nome: NomeIcone;
  tamanho?: number;
  className?: string;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={CAMINHOS[nome]} />
    </svg>
  );
}
