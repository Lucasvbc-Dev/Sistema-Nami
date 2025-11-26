import { api } from "./api";

export async function listarDevolucoes() {
  const response = await api.get("/retornos");
  return response.data;
}

export async function registrarDevolucao(dados: any) {
  const response = await api.post("/retornos", dados);
  return response.data;
}

export async function atualizarDevolucao(id: number, dados: any) {
  const response = await api.put(`/retornos/${id}`, dados);
  return response.data;
}

export async function deletarDevolucao(id: number) {
  await api.delete(`/retornos/${id}`);
}
