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
import { listarEquipamentos, salvarEquipamento } from "@/services/EquipamentoService";
import{useEffect}from"react";


export default function Equipamentos() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patrimonio: "",
    nome: "",
    setor: "",
    estado: "",
    descricao: "",
  });



  const [equipamentos, setEquipamentos] = useState<any[]>([]);

  useEffect(() => {
  async function carregarEquipamentos() {
    try {
      const data = await listarEquipamentos();
      setEquipamentos(data);
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
    }
  }


  carregarEquipamentos();
}, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await salvarEquipamento(formData);
    console.log("Equipamento salvo com sucesso!");

    const atualizados = await listarEquipamentos();
    setEquipamentos(atualizados);

    setFormData({ patrimonio: "", nome: "", setor: "", estado: "", descricao: "" });
    setShowForm(false);
  } catch (error) {
    console.error("Erro ao salvar equipamento:", error);
  }
};


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Cadastro de Equipamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Adicione e gerencie equipamentos no sistema
          </p>
        </div>

        {/* Formulário de Novo Equipamento */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Novo Equipamento
                </CardTitle>
                <CardDescription>
                  Preencha os dados do equipamento para cadastrá-lo
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
                  {/* Código */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Código de Patrimônio*
                    </label>
                    <Input
                      type="text"
                      name="patrimonio"
                      placeholder="Ex: MO-200"
                      value={formData.patrimonio}
                      onChange={handleInputChange}
                      className="border border-input rounded-lg"
                    />
                  </div>

                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Nome do Equipamento*
                    </label>
                    <Input
                      type="text"
                      name="nome"
                      placeholder="Ex: Microscópio Óptico"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="border border-input rounded-lg"
                    />
                  </div>

                  {/* Setor */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Setor*
                    </label>
                    <Select
                      value={formData.setor}
                      onValueChange={(value) =>
                        handleSelectChange("setor", value)
                      }
                    >
                      <SelectTrigger className="border border-input rounded-lg">
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laboratorio">Laboratório</SelectItem>
                        <SelectItem value="Diagnostico">Diagnóstico</SelectItem>
                        <SelectItem value="Modelos">Modelos Anatômicos</SelectItem>
                        <SelectItem value="Cirurgico">Instrumentos Cirúrgicos</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado de Conservação */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Estado de Conservação*
                    </label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) =>
                        handleSelectChange("estado", value)
                      }
                    >
                      <SelectTrigger className="border border-input rounded-lg">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excelente">Excelente</SelectItem>
                        <SelectItem value="Bom">Bom</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Ruim">Ruim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Descrição (opcional)
                  </label>
                  <textarea
                    name="descricao"
                    placeholder="Informações adicionais sobre o equipamento..."
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                {/* Botão de Envio */}
                <Button
                  type="submit"
                  className="bg-primary hover:bg-blue-800 text-white font-semibold"
                >
                  Cadastrar Equipamento
                </Button>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Tabela de Equipamentos Cadastrados */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">
              Equipamentos Cadastrados
            </CardTitle>
            <CardDescription>
              Lista completa de equipamentos no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Patrimônio
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Setor
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentos.map((equip) => (
                    <tr
                      key={equip.id}
                      className="border-b border-border hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">
                        {equip.patrimonio}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {equip.nome}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {equip.setor}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            equip.estado === "Disponível"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {equip.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {equip.descricao}
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
