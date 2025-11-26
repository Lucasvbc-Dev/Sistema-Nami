import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { listarSaidas, registrarRetorno, listarRetornos } from "@/services/RegistroSaidaService";

// Interfaces para tipagem correta dos dados vindos do Backend
interface Equipamento {
  nome: string;
  codigo?: string;
  patrimonio?: string;
}

interface Usuario {
  nome: string;
}

interface RegistroSaida {
  idSaida?: number;
  id?: number;
  equipamento?: Equipamento;
  nomeEquipamento?: string;
  responsavel?: Usuario;
  nomeResponsavel?: string;
  dataSaida: string;
  statusEmprestimo?: string;
  status?: string;
}

interface RegistroRetorno {
  idRetorno: number;
  idEmprestimo: number;
  equipamento?: Equipamento;
  nomeEquipamento?: string;
  responsavel?: Usuario;
  nomeResponsavel?: string;
  dataSaida: string;
  dataRetorno: string;
  estadoRetorno: string;
  observacoes?: string;
}

export default function RegistroRetorno() {
  // Estados para armazenar listas vindas da API
  const [listaSaidas, setListaSaidas] = useState<RegistroSaida[]>([]);
  const [listaSaidasCompleta, setListaSaidasCompleta] = useState<RegistroSaida[]>([]);
  const [historicoDevolucoes, setHistoricoDevolucoes] = useState<RegistroRetorno[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    emprestimoAtivo: "",
    estadoRetorno: "",
    observacoes: "",
  });

  // Carrega dados iniciais ao abrir a página
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    await Promise.all([
      fetchSaidas(),
      fetchRetornos()
    ]);
    setLoading(false);
  };

  const fetchSaidas = async () => {
    try {
      console.log("Buscando saídas...");
      
      // Usa o service que já existe no projeto
      const data = await listarSaidas();
      console.log("Saídas recebidas da API:", data);
      
      // Guarda lista completa para referência
      setListaSaidasCompleta(data);
      
      // Filtra apenas empréstimos ativos
      const saidasAtivas = data.filter((item: any) => {
        const status = item.statusEmprestimo || item.status || "";
        return status.toUpperCase() === "EMPRESTADO" || 
               status.toUpperCase() === "ATIVO" ||
               status === "Ativo";
      });
      
      console.log("Saídas ativas filtradas:", saidasAtivas);
      setListaSaidas(saidasAtivas);
      
      if (saidasAtivas.length === 0) {
        console.warn("Nenhum empréstimo ativo encontrado. Verifique o status dos empréstimos no banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      alert("Erro ao carregar empréstimos ativos. Verifique a conexão com o servidor.");
    }
  };

  const fetchRetornos = async () => {
    try {
      console.log("Buscando retornos...");
      
      // Tenta usar o service do projeto
      let data = null;
      
      try {
        data = await listarRetornos();
        console.log("Retornos carregados via service:", data);
      } catch (serviceError) {
        console.error("Service não disponível, tentando diretamente:", serviceError);
      }

      if (data && Array.isArray(data)) {
        // Enriquece os dados de retorno com informações das saídas
        const retornosEnriquecidos = data.map((retorno: any) => {
          const saidaCorrespondente = listaSaidasCompleta.find(
            (saida: any) => (saida.idSaida || saida.id) === retorno.idEmprestimo
          );
          
          return {
            ...retorno,
            equipamento: saidaCorrespondente?.equipamento,
            nomeEquipamento: saidaCorrespondente?.equipamento?.nome || saidaCorrespondente?.nomeEquipamento,
            responsavel: saidaCorrespondente?.responsavel,
            nomeResponsavel: saidaCorrespondente?.responsavel?.nome || saidaCorrespondente?.nomeResponsavel
          };
        });
        
        console.log("Retornos enriquecidos:", retornosEnriquecidos);
        setHistoricoDevolucoes(retornosEnriquecidos);
      } else {
        console.warn("Nenhum retorno encontrado");
        setHistoricoDevolucoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setHistoricoDevolucoes([]);
    }
  };

  // Função auxiliar para formatar data (YYYY-MM-DD -> DD/MM/YYYY)
  const formatarData = (dataString: string) => {
    if (!dataString) return "-";
    try {
      const dataLimpa = dataString.split("T")[0];
      const [ano, mes, dia] = dataLimpa.split("-");
      return `${dia}/${mes}/${ano}`;
    } catch {
      return dataString;
    }
  };

  // --- Traduz o ID numérico para Nome na Tabela ---
  const getDetalhesEmprestimo = (retorno: RegistroRetorno) => {
    // Primeiro tenta pegar do próprio retorno enriquecido
    const nomeEquipamento = retorno.nomeEquipamento || retorno.equipamento?.nome;
    const nomeResponsavel = retorno.nomeResponsavel || retorno.responsavel?.nome;
    
    if (nomeEquipamento && nomeResponsavel) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {nomeEquipamento}
          </span>
          <span className="text-xs text-gray-500">
            Resp: {nomeResponsavel}
          </span>
        </div>
      );
    }
    
    // Senão, procura na lista completa de saídas
    const saida = listaSaidasCompleta.find((item) => (item.idSaida || item.id) === retorno.idEmprestimo);
    
    if (saida) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {saida.equipamento?.nome || saida.nomeEquipamento || "Equipamento desconhecido"}
          </span>
          <span className="text-xs text-gray-500">
            Resp: {saida.responsavel?.nome || saida.nomeResponsavel || "N/A"}
          </span>
        </div>
      );
    }
    
    // Caso não encontre
    return <span className="text-gray-400 italic">Empréstimo ID: {retorno.idEmprestimo}</span>;
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.emprestimoAtivo || !formData.estadoRetorno) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Encontrar o objeto de Saída selecionado
    const saidaSelecionada = listaSaidas.find(
      (item) => (item.idSaida || item.id)?.toString() === formData.emprestimoAtivo
    );

    if (!saidaSelecionada) {
      alert("Erro: Empréstimo não encontrado na lista.");
      return;
    }

    const payload = {
      idEmprestimo: parseInt(formData.emprestimoAtivo),
      estadoRetorno: formData.estadoRetorno,
      observacoes: formData.observacoes,
      dataRetorno: new Date().toISOString().split("T")[0],
      dataSaida: saidaSelecionada.dataSaida,
    };

    console.log("Enviando payload:", payload);

    try {
      setLoading(true);
      
      // Tenta usar o service do projeto
      await registrarRetorno(payload);
      
      alert("Retorno registrado com sucesso!");
      setFormData({ emprestimoAtivo: "", estadoRetorno: "", observacoes: "" });
      await carregarDados(); // Recarrega tudo
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      alert("Erro ao registrar retorno: " + (error.message || "Verifique se o serviço está configurado corretamente"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Registro de Retorno
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre a devolução de equipamentos emprestados
          </p>
        </div>

        {/* Mensagem de debug */}
        {listaSaidas.length === 0 && !loading && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                ⚠️ Nenhum empréstimo ativo encontrado. Certifique-se de que há equipamentos emprestados com status "EMPRESTADO" ou "Ativo".
              </p>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Novo Retorno */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Novo Retorno de Equipamento
            </CardTitle>
            <CardDescription>
              Preencha os dados para registrar o retorno
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Select de Empréstimo Ativo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Empréstimo Ativo* ({listaSaidas.length} disponíveis)
                  </label>
                  <Select
                    value={formData.emprestimoAtivo}
                    onValueChange={(value) =>
                      handleSelectChange("emprestimoAtivo", value)
                    }
                    disabled={loading || listaSaidas.length === 0}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Selecione o empréstimo" />
                    </SelectTrigger>
                    <SelectContent>
                      {listaSaidas.length > 0 ? (
                        listaSaidas.map((saida) => {
                          const id = saida.idSaida || saida.id;
                          const nomeEquip = saida.equipamento?.nome || saida.nomeEquipamento || "Sem nome";
                          const nomeResp = saida.responsavel?.nome || saida.nomeResponsavel || "Sem responsável";
                          const dataSaida = formatarData(saida.dataSaida);
                          
                          return (
                            <SelectItem key={id} value={id?.toString() || ""}>
                              {nomeEquip} - {nomeResp} (Saiu: {dataSaida})
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem value="0" disabled>
                          Nenhum empréstimo ativo encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select de Estado */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Estado de Retorno*
                  </label>
                  <Select
                    value={formData.estadoRetorno}
                    onValueChange={(value) =>
                      handleSelectChange("estadoRetorno", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Avalie o estado do equipamento" />
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

              {/* Observações */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Observações (opcional)
                </label>
                <textarea
                  name="observacoes"
                  placeholder="Adicione observações..."
                  value={formData.observacoes}
                  onChange={handleTextareaChange}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-blue-800 text-white font-semibold"
                disabled={!formData.emprestimoAtivo || !formData.estadoRetorno || loading}
              >
                {loading ? "Processando..." : "Registrar Retorno"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabela Histórico */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">
              Histórico de Devoluções ({historicoDevolucoes.length})
            </CardTitle>
            <CardDescription>
              Equipamentos devolvidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Carregando...</p>
              ) : historicoDevolucoes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Nenhum retorno registrado ainda.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Equipamento / Responsável
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Data Saída
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Data Retorno
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Condição
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoDevolucoes.map((devolucao) => (
                      <tr
                        key={devolucao.idRetorno}
                        className="border-b border-border hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 align-middle">
                          {getDetalhesEmprestimo(devolucao)}
                        </td>
                        
                        <td className="px-4 py-3 text-foreground align-middle">
                          {formatarData(devolucao.dataSaida)}
                        </td>
                        <td className="px-4 py-3 text-foreground align-middle">
                          {formatarData(devolucao.dataRetorno)}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {devolucao.estadoRetorno}
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