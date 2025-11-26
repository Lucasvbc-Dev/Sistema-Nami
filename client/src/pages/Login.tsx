import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import uniforLogo from "@/image/unifor.png";


export default function Login() {
  const { login } = useAuth(); // <-- usa a função de login fake
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await login(email, password); // chama sua função real de login
    navigate("/dashboard");
  } catch (error) {
    alert("Email ou senha incorretos");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Logo e Título */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <span className="text-blue-600 text-2xl"><img src={uniforLogo} alt="Logo Unifor" className="w-16 h-16" /></span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Sistema NAMI</h1>
              <p className="text-sm text-gray-500">
                Gerenciamento de Equipamentos
              </p>
            </div>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="seu.email@faculdade.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>

          {/* Rodapé */}
          <p className="text-center text-xs text-gray-400">
            Acesso restrito a funcionários e alunos da instituição
          </p>
        </div>
      </div>
    </div>
  );
}
