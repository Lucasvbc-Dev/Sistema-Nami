import { api } from "./api";

export async function listarEquipamentos() {
  const response = await api.get("/equipamentos");
  return response.data;
}

export async function salvarEquipamento(dados: any) {
  const response = await api.post("/equipamentos", dados);
  return response.data;
}

export async function atualizarEquipamento(id: number, dados: any) {
  const response = await api.put(`/equipamentos/${id}`, dados);
  return response.data;
}

export async function deletarEquipamento(id: number) {
  await api.delete(`/equipamentos/${id}`);
}
