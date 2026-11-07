import { useState, useEffect } from "react";

type Tema = "claro" | "escuro";

// O script no index.html já colocou (ou não) a classe "dark" no <html>
function temaAtual(): Tema {
  return document.documentElement.classList.contains("dark") ? "escuro" : "claro";
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaAtual);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "escuro");
  }, [tema]);

  function alternarTema() {
    const novoTema = tema === "escuro" ? "claro" : "escuro";
    setTema(novoTema);

    // Só salva quando a pessoa escolhe; antes disso o app segue o tema do sistema
    try {
      localStorage.setItem("tema", novoTema);
    } catch {
      // Navegação privada pode bloquear o localStorage; o tema só não fica salvo
    }
  }

  return { tema, alternarTema };
}
