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
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import RelatorioService from "@/services/RelatorioService";

export default function Relatorios() {
  const [filtros, setFiltros] = useState({
    tipoRelatorio: "",
    periodo: "",
    categoria: "todas",
  });

  const [relatorioGerado, setRelatorioGerado] = useState(false);
  const [estatisticas, setEstatisticas] = useState<any[]>([]);
  const [dadosTabela, setDadosTabela] = useState<any[]>([]);

  const handleSelectChange = (name: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // Função para filtrar dados por período
  const filtrarPorPeriodo = (dados: any[], periodo: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return dados.filter((item: any) => {
      const dataSaida = new Date(item.dataSaida || item.data);
      dataSaida.setHours(0, 0, 0, 0);

      switch (periodo) {
        case "hoje":
          return dataSaida.getTime() === hoje.getTime();
        
        case "semana":
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          return dataSaida >= inicioSemana && dataSaida <= hoje;
        
        case "mês":
          return (
            dataSaida.getMonth() === hoje.getMonth() &&
            dataSaida.getFullYear() === hoje.getFullYear()
          );
        
        case "ano":
          return dataSaida.getFullYear() === hoje.getFullYear();
        
        default:
          return true;
      }
    });
  };

  const handleGerarRelatorio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filtros.tipoRelatorio || !filtros.periodo) {
      alert("Por favor, selecione o tipo de relatório e o período!");
      return;
    }

    try {
      const dados = await RelatorioService.getRelatorio(filtros);
      
      // Filtra os dados pelo período selecionado
      const dadosFiltrados = filtrarPorPeriodo(dados.resultados || [], filtros.periodo);
      
      setDadosTabela(dadosFiltrados);
      setRelatorioGerado(true);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório");
    }
  };

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const res = await RelatorioService.getEstatisticas();
        
        // Remove o card "Em manutenção" - mantém apenas os 3 primeiros
        const estatisticasFiltradas = res.filter((stat: any) => 
          stat.titulo !== "Em manutenção" && 
          stat.titulo !== "Em Manutenção"
        ).slice(0, 3);
        
        setEstatisticas(estatisticasFiltradas);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    }
    carregarEstatisticas();
  }, []);

  const handleExportar = () => {
    // Passa os dados filtrados para o PDF
    RelatorioService.exportarPDF({
      ...filtros,
      dados: dadosTabela, // Passa os dados já filtrados
      totalRegistros: dadosTabela.length
    });
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    if (!dataString) return "N/A";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    } catch {
      return dataString;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Gere relatórios detalhados sobre o uso de equipamentos
          </p>
        </div>

        {/* Cards de Estatísticas - Apenas 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estatisticas.map((stat: any, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  {stat.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.valor}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Filtros de Relatório
            </CardTitle>
            <CardDescription>Configure os parâmetros do relatório desejado</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGerarRelatorio} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Tipo de Relatório*
                  </label>
                  <Select
                    value={filtros.tipoRelatorio}
                    onValueChange={(value) => handleSelectChange("tipoRelatorio", value)}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emprestimos">Empréstimos Ativos</SelectItem>
                      <SelectItem value="atrasos">Equipamentos em Atraso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Período */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Período*
                  </label>
                  <Select
                    value={filtros.periodo}
                    onValueChange={(value) => handleSelectChange("periodo", value)}
                  >
                    <SelectTrigger className="border border-input rounded-lg">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mês">Este Mês</SelectItem>
                      <SelectItem value="ano">Este Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-blue-800 text-white font-semibold"
                >
                  Gerar Relatório
                </Button>

                {relatorioGerado && dadosTabela.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleExportar}
                    variant="outline"
                    className="border-primary text-primary hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Resultado do Relatório</CardTitle>
          </CardHeader>

          <CardContent>
            {relatorioGerado ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Relatório de {filtros.tipoRelatorio} — Período: {filtros.periodo}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    Total de registros encontrados: {dadosTabela.length}
                  </p>

                  {/* Tabela */}
                  <div className="overflow-x-auto">
                    {dadosTabela.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        Nenhum registro encontrado para o período selecionado
                      </p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-white border-b border-blue-200">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold">Equipamento</th>
                            <th className="px-4 py-2 text-left font-semibold">Responsável</th>
                            <th className="px-4 py-2 text-left font-semibold">Data</th>
                            <th className="px-4 py-2 text-left font-semibold">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {dadosTabela.map((item: any, index) => (
                            <tr key={index} className="border-b border-blue-100">
                              <td className="px-4 py-2">
                                {item.equipamento || item.nomeEquipamento || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {item.responsavel || item.nomeResponsavel || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {formatarData(item.data || item.dataSaida)}
                              </td>
                              <td className="px-4 py-2">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                  {item.status || item.statusEmprestimo || "Ativo"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground text-center">
                  Selecione um tipo de relatório e período para visualizar os dados
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}