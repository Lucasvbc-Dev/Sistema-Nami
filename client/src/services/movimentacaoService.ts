// services/movimentacaoService.ts
import { api } from "./api";

export async function listarMovimentacoesRecentes() {
  const response = await api.get("/movimentacoes/recentes");
  return response.data;
}
