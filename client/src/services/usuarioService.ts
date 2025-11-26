import { api } from "./api";

export async function listarUsuario(){
    const response = await api.get("/usuarios");
    return response.data;
}

export async function salvarUsuario(dados: any){
    const response = await api.post("/usuarios", dados);
    return response.data;
}

export async function atualizarUsuario(id: number, dados: any){
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
}

export async function deletarUsuario(id: number){
    await api.delete(`/usuarios/${id}`);
}
