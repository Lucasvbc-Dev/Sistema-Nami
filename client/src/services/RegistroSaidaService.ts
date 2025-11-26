import { api } from "./api";

// Funções de Saídas (já existentes)
export async function listarSaidas() {
  const response = await api.get("/saidas");
  return response.data;
}

export async function registrarSaida(dados: any) {
  const response = await api.post("/saidas", dados);
  return response.data;
}

export async function atualizarSaida(id: number, dados: any) {
  const response = await api.put(`/saidas/${id}`, dados);
  return response.data;
}

export async function deletarSaida(id: number) {
  await api.delete(`/saidas/${id}`);
}

// ========== FUNÇÕES DE RETORNO (ADICIONAR) ==========

export async function listarRetornos() {
  const response = await api.get("/retornos");
  return response.data;
}

export async function registrarRetorno(dados: any) {
  const response = await api.post("/retornos", dados);
  return response.data;
}

export async function atualizarRetorno(id: number, dados: any) {
  const response = await api.put(`/retornos/${id}`, dados);
  return response.data;
}

export async function deletarRetorno(id: number) {
  await api.delete(`/retornos/${id}`);
}