import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Adiciona o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Erro 401 - Não autenticado
      if (error.response.status === 401) {
        console.error("Erro 401: Token inválido ou expirado");
        localStorage.removeItem("token");
        // Redireciona para login se necessário
        // window.location.href = "/login";
      }
      
      // Erro 403 - Sem permissão
      if (error.response.status === 403) {
        console.error("Erro 403: Acesso negado", error.response.data);
      }

      // Erro 404 - Não encontrado
      if (error.response.status === 404) {
        console.error("Erro 404: Endpoint não encontrado", error.config.url);
      }
    } else if (error.request) {
      console.error("Erro na requisição: Servidor não respondeu", error.request);
    } else {
      console.error("Erro:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;