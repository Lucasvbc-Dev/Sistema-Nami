import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { set } from "zod";
import { listarUsuario, salvarUsuario } from "@/services/usuarioService";
import { useEffect } from "react";



export default function Usuarios() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    status: "",
  });

  
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    console.log("Enviando dados para o back:", formData);

    await salvarUsuario(formData);
    console.log("Usuário salvo com sucesso!");

    // Atualiza lista
    const atualizados = await listarUsuario();
    setUsuarios(atualizados);

    // Limpa form
    setFormData({
      nome: "",
      email: "",
      cargo: "",
      departamento: "",
      status: "",
    });

    setShowForm(false); // fecha o form no final
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
};


useEffect(() => {
  async function carregarUsuarios() {
    try {
      const data = await listarUsuario();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  carregarUsuarios();
}, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Cadastro de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Adicione e gerencie usuários/responsáveis no sistema
          </p>
        </div>

        {/* Formulário de Novo Usuário */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Novo Usuário
                </CardTitle>
                <CardDescription>
                  Preencha os dados do usuário para cadastrá-lo
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "destructive" : "default"}
                className="bg-primary hover:bg-blue-800"
              >
                {showForm ? "Cancelar" : "Adicionar"}
              </Button>
            </div>
          </CardHeader>

         {showForm && (
  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Nome Completo*
          </label>
          <Input
            type="text"
            name="nome"
            placeholder="Ex: João Silva"
            value={formData.nome}
            onChange={handleInputChange}
            className="border border-input rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Email*
          </label>
          <Input
            type="email"
            name="email"
            placeholder="Ex: joao@faculdade.edu.br"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-input rounded-lg"
          />
        </div>

        {/* Cargo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Cargo*
          </label>
          <Select
            value={formData.cargo}
            onValueChange={(value) =>
              handleSelectChange("cargo", value)
            }
          >
            <SelectTrigger className="border border-input rounded-lg">
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Funcionario">Funcionário</SelectItem>
              <SelectItem value="Aluno">Aluno</SelectItem>
              <SelectItem value="Tecnico">Técnico</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Departamento
          </label>
          <Input
            type="text"
            name="departamento"
            placeholder="Ex: Medicina"
            value={formData.departamento}
            onChange={handleInputChange}
            className="border border-input rounded-lg"
          />
        </div>

        {/* Status */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-foreground">
    Status*
  </label>
  <Select
    value={formData.status}
    onValueChange={(value) => handleSelectChange("status", value)}
  >
    <SelectTrigger className="border border-input rounded-lg">
      <SelectValue placeholder="Selecione o status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ATIVO">Ativo</SelectItem>
      <SelectItem value="INATIVO">Inativo</SelectItem>
    </SelectContent>
  </Select>
</div>

      </div>

      {/* Botão */}
      <Button
        type="submit"
        className="bg-primary hover:bg-blue-800 text-white font-semibold"
      >
        Cadastrar Usuário
      </Button>
    </form>
  </CardContent>
)}

        </Card>

        {/* Tabela de Usuários Cadastrados */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">
              Usuários Cadastrados
            </CardTitle>
            <CardDescription>
              Lista completa de usuários no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Cargo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Departamento
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-border hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">
                        {usuario.nome}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {usuario.email}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {usuario.cargo}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {usuario.departamento}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {usuario.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
