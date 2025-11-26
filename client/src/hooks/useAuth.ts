import { useCallback, useMemo, useState } from "react";
import api from "../services/api";

type User = {
  id: number;
  email: string;
  role: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const state = useMemo(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    return {
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: !!storedToken,
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email, 
        password: password,
      });

      const { token, user } = response.data;

      // salva token
      localStorage.setItem("token", token);

      // salva usuário para o sistema
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return {
    ...state,
    login,
    logout,
    loading,
  };
}