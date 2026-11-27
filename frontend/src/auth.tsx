import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { UsuarioSessao } from './types';

const CHAVE = 'sessao-usuario';

// localStorage só existe no navegador (e pode falhar em aba privada),
// por isso tudo fica dentro de try/catch.
function lerSessao(): UsuarioSessao | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as UsuarioSessao) : null;
  } catch {
    return null;
  }
}

function gravarSessao(u: UsuarioSessao | null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (u) window.localStorage.setItem(CHAVE, JSON.stringify(u));
    else window.localStorage.removeItem(CHAVE);
  } catch {
    // sem persistência: a sessão vale só até recarregar a página
  }
}

interface AuthContextValue {
  usuario: UsuarioSessao | null;
  pronto: boolean; // já tentou recuperar a sessão salva
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setUsuario(lerSessao());
    setPronto(true);
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const sessao = await api.usuarios.login(email.trim(), senha);
    gravarSessao(sessao);
    setUsuario(sessao);
  }, []);

  const sair = useCallback(() => {
    gravarSessao(null);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, pronto, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
