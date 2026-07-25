import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import * as authService from "../services/auth";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function confirmarSessao() {
      const token = localStorage.getItem("token");

      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const dadosUsuario = await authService.me();
        setUsuario(dadosUsuario);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setCarregando(false);
      }
    }

    confirmarSessao();
  }, []);

  async function login(email: string, senha: string) {
    const resposta = await authService.login(email, senha);

    localStorage.setItem("token", resposta.token);
    setUsuario(resposta.usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }

  return context;
}