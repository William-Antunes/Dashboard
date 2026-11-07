import type { ReactNode } from "react";

// Layout compartilhado de Login e Cadastro
export default function TelaAcesso({
  titulo,
  descricao,
  children,
  rodape,
}: {
  titulo: string;
  descricao: string;
  children: ReactNode;
  rodape: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="marca h-7 w-7" aria-hidden="true" />
          Faculdade
        </div>

        <h1 className="titulo-pagina">{titulo}</h1>
        <p className="mb-8 mt-1 text-lapis">{descricao}</p>

        {children}

        <p className="mt-8 text-sm text-lapis">{rodape}</p>
      </div>
    </div>
  );
}
