import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import uniforLogo from "@/image/unifor.png";
import { listarEquipamentos } from "@/services/equipamentoService";
import { useEffect } from "react";
import { useState } from "react";
import { listarUsuario } from "@/services/UsuarioService";
import { ca } from "date-fns/locale";
import React from "react";
import { listarMovimentacoesRecentes } from "@/services/movimentacaoService";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuariosData = await listarUsuario();
        const equipamentosData = await listarEquipamentos();
        setUsuarios(usuariosData);
        setEquipamentos(equipamentosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    carregarDados();
  }, []);

  const stats = [
    {
      title: "Total Equipamentos",
      value: equipamentos.length,
      description: "Cadastrados no sistema",
    },
    {
      title: "Total de Usuários",
      value: usuarios.length,
      description: "Com acesso ao sistema",
    },
  ];

  // Dados de atividades recentes
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecentActivities() {
      try {
        const activities = await listarMovimentacoesRecentes();
        
        // Mapear os dados da API para o formato esperado
        const formattedActivities = activities.map((item: any) => ({
  id: item.id,
  type: item.tipo,                     // "Saída", "Retorno", "Novo Usuário", "Novo Equipamento"
  equipment: item.descricao,           // descrição enviada pelo DTO
  responsible: "-",                    // não existe mais responsável no DTO atual
  sdate: item.data ? format(new Date(item.data), "dd/MM/yyyy") : "—",
  status: item.tipo === "Saída" || item.tipo === "Retorno" ? "Movimentação" : "Cadastro"
}));

        
        setRecentActivities(formattedActivities);
      } catch (error) {
        console.error("Erro ao carregar atividades recentes:", error);
      }
    }
    fetchRecentActivities();
  }, []);

  // Agrupa equipamentos por setor (ou categoria se setor não existir)
  const categorias = equipamentos.reduce((acc, item) => {
    const categoria = item.setor || item.categoria || "Outros";
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  // Dados para o gráfico de equipamentos por categoria
  const categoryData = Object.entries(categorias).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  // Calcula o total para as porcentagens
  const totalEquipamentos = equipamentos.length || 1;

  const colors = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título da Página */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de gerenciamento de equipamentos
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção de Atividades e Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Atividades Recentes */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-foreground">Atividades Recentes</CardTitle>
              <CardDescription>Últimas movimentações de equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Nenhuma atividade recente registrada
                  </p>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold text-white ${
                            activity.type === "Saída"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {activity.type}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.equipment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.responsible}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          activity.status === "Ativo"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Equipamentos por Categoria */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-foreground">
                Equipamentos por Setor
              </CardTitle>
              <CardDescription>Distribuição por tipo de equipamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryData.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Nenhum equipamento cadastrado
                  </p>
                ) : (
                  categoryData.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">
                          {category.name}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {category.value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(category.value / totalEquipamentos) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}