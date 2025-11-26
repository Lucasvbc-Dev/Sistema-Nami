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
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { listarUsuario } from "@/services/usuarioService";
import { listarEquipamentos } from "@/services/EquipamentoService";
import { listarSaidas, registrarSaida } from "@/services/RegistroSaidaService";
import { format } from 'date-fns';

export default function RegistroSaida() {
  const [formData, setFormData] = useState({
    equipamento: "",
    responsavel: "",
    dataPrevista: "",
  });

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuários
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const usuariosData = await listarUsuario();
        setUsuarios(usuariosData);
        console.log("Usuários carregados:", usuariosData);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setError("Erro ao carregar usuários");
      }
    }
    carregarUsuarios();
  }, []);

  // Carregar equipamentos
  useEffect(() => {
    async function carregarEquipamentos() {
      try {
        const equipamentosData = await listarEquipamentos();
        setEquipamentos(equipamentosData);
        console.log("Equipamentos carregados:", equipamentosData);
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error);
        setError("Erro ao carregar equipamentos");
      }
    }
    carregarEquipamentos();
  }, []);

  // Carregar saídas
  useEffect(() => {
    async function carregarSaidas() {
      try {
        const saidasData = await listarSaidas();
        setSaidas(saidasData);
        console.log("Saídas carregadas:", saidasData);
      } catch (error) {
        console.error("Erro ao carregar saídas:", error);
        setError("Erro ao carregar saídas");
      }
    }
    carregarSaidas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário submetido!", formData);

    // Validação
    if (!formData.equipamento || !formData.responsavel || !formData.dataPrevista) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dadosFormatados = {
        equipamento: formData.equipamento,
        responsavel: formData.responsavel,
        dataPrevista: formData.dataPrevista,
      };

      console.log("Enviando dados:", dadosFormatados);

      const resultado = await registrarSaida(dadosFormatados);
      console.log("Resultado:", resultado);

      alert("Saída registrada com sucesso!");

      // Atualiza tabela automaticamente
      const novasSaidas = await listarSaidas();
      setSaidas(novasSaidas);

      // Limpar form
      setFormData({
        equipamento: "",
        responsavel: "",
        dataPrevista: "",
      });

    } catch (error: any) {
      console.error("Erro ao registrar saída:", error);
      setError(error.message || "Erro ao registrar saída");
      alert("Erro ao registrar saída: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    if (!dataString) return "N/A";
    try {
      return format(new Date(dataString), "dd/MM/yyyy");
    } catch {
      return dataString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Registro de Saída
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre o empréstimo de equipamentos
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Formulário de Nova Saída */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Nova Saída de Equipamento
            </CardTitle>
            <CardDescription>
              Preencha os dados para registrar a saída
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Equipamento */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Equipamento*
                  </label>
                  <Select
                    value={formData.equipamento}
                    onValueChange={(value) => handleSelectChange("equipamento", value)}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipamentos.length > 0 ? (
                        equipamentos.map((equipamento) => (
                          <SelectItem key={equipamento.id} value={equipamento.nome}>
                            {equipamento.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Nenhum equipamento cadastrado
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Responsável */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Responsável*
                  </label>
                  <Select
                    value={formData.responsavel}
                    onValueChange={(value) => handleSelectChange("responsavel", value)}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.nome}>
                            {usuario.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Nenhum usuário cadastrado
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Prevista de Retorno */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Data Prevista de Retorno*
                  </label>
                  <Input
                    type="date"
                    name="dataPrevista"
                    value={formData.dataPrevista}
                    onChange={handleInputChange}
                    className="border border-input rounded-lg"
                  />
                </div>
              </div>

              {/* Botão de Envio */}
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Saída"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabela de Equipamentos Emprestados */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">
              Equipamentos Emprestados
            </CardTitle>
            <CardDescription>
              Lista de equipamentos atualmente em uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {saidas.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Nenhum equipamento emprestado no momento
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Patrimônio
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Equipamento
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Responsável
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Data de Saída
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Retorno Previsto
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {saidas.map((saida) => (
                      <tr key={saida.id || saida.idSaida} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-foreground font-medium">
                          {saida.equipamento?.patrimonio || 
                           saida.equipamento?.codigo || 
                           saida.patrimonio ||
                           saida.codigo || 
                           "N/A"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {saida.equipamento?.nome || saida.nomeEquipamento || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {saida.responsavel?.nome || saida.nomeResponsavel || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatarData(saida.dataSaida)}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatarData(saida.dataPrevista || saida.dataRetorno)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {saida.status || saida.statusEmprestimo || "EMPRESTADO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}