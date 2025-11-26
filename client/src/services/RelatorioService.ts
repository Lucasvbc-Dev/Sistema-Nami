  import { api } from "./api";

  class RelatorioService {
    async getEstatisticas() {
      const res = await api.get("/relatorios/estatisticas");
      return res.data;
    }

    async getRelatorio(filtros: any) {
      const res = await api.post("/relatorios/gerar", filtros);
      return res.data;
    }

    async exportarPDF(filtros: any) {
      const res = await api.post("/relatorios/exportar", filtros, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "relatorio.pdf";
      link.click();
    }
  }

  export default new RelatorioService();
