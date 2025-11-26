#  Sistema de Gerenciamento de Equipamentos - NAMI

Este projeto consiste em um **Sistema de Gerenciamento de Equipamentos** desenvolvido para o **NAMI – UNIFOR (Universidade de Fortaleza)**. Seu objetivo principal é fornecer uma solução robusta e eficiente para o controle de empréstimo (saída) e devolução (retorno) de equipamentos institucionais, registrando responsáveis, datas, status e histórico de uso.

##  Tecnologias Utilizadas

O sistema foi construído utilizando uma arquitetura moderna e um conjunto de tecnologias de ponta, garantindo desempenho, escalabilidade e uma experiência de usuário fluida.

| Categoria | Tecnologia | Versão/Detalhe |
| :--- | :--- | :--- |
| **Linguagem Principal** | Java | 21 |
| **Back-end** | Java | 21 |
| **Banco de Dados** | MySQL Workbench | 8.0 |
| **Front-end** | React | - |
| **Framework/Estilização** | Vite e TailwindCSS | - |
| **Ferramentas de Desenvolvimento** | VS Code, Intellij IDEA, GitHub | - |

##  Funcionalidades Principais

O sistema abrange todas as etapas do ciclo de vida do equipamento dentro da instituição, desde o cadastro até a geração de relatórios.

### 1. Autenticação e Acesso
*   **Login por Credenciais:** Autenticação de usuários via Email Institucional e Senha.
*   **Validação de Acesso:** Redirecionamento para o Dashboard após validação bem-sucedida.

### 2. Dashboard (Visão Geral)
*   **Exibição de KPIs:** Visualização em tempo real do Total de Equipamentos, Equipamentos Emprestados, Usuários Ativos e Devoluções Pendentes (com itens em atraso).
*   **Atividades Recentes:** Listagem das últimas movimentações (Saída e Retorno).
*   **Distribuição por Categoria:** Gráfico ou tabela da distribuição percentual de equipamentos por Categoria.

### 3. Gerenciamento de Equipamentos
*   **Cadastro:** Registro com Código de patrimônio(único), Nome, Categoria, Estado de Conservação e Descrição.
*   **Listagem e Pesquisa:** Exibição de lista paginada e pesquisável, mostrando Status e Condição.
*   **Atualização de Status:** Status automático para "Emprestado", "Disponível" ou "Atrasado".

### 4. Gerenciamento de Usuários
*   **Cadastro:** Registro de Nome Completo, Email Institucional (único), Cargo e Departamento.
*   **Listagem:** Exibição de lista paginada e pesquisável com Status (Ativo/Inativo).

### 5. Controle de Empréstimos (Saída)
*   **Registro de Empréstimo:** Seleção de Equipamento (disponível), Responsável, Data Prevista de Retorno e Finalidade.
*   **Empréstimos Ativos:** Listagem dos empréstimos em curso com Status (Ativo ou Atrasado).
*   **Alerta Visual de Atraso:** Destaque visual para empréstimos com Data Prevista de Retorno ultrapassada.

### 6. Controle de Devoluções (Retorno)
*   **Registro de Devolução:** Seleção de Empréstimo Ativo, avaliação do Estado de Conservação e Observações.
*   **Histórico de Devoluções:** Exibição do histórico recente com Data de Saída, Data de Retorno e Condição.

### 7. Relatórios
*   **Métricas de Resumo:** Exibição de Total de Equipamentos, Empréstimos Ativos e Devoluções no Mês.
*   **Filtros:** Geração de relatórios detalhados com filtros por Tipo, Período e Categoria.
*   **Exportação de Dados:** Permite exportação para formatos PDF.

##  Requisitos Não Funcionais (RNF)

O projeto adere a requisitos de qualidade essenciais para um sistema institucional.

| Categoria | Descrição |
| :--- | :--- |
| **Usabilidade** | Interface responsiva e consistente em todas as telas. |
| **Segurança** | Uso de criptografia (HTTPS/SSL) e armazenamento seguro de senhas (hashing com salt). |
| **Desempenho** | Carregamento do Dashboard e geração de relatórios em no máximo 3 segundos. |
| **Integridade de Dados** | Atualização atômica do status do equipamento e do empréstimo. |
| **Auditoria** | Registro de usuário responsável e timestamp para todas as operações de cadastro e movimentação. |


##  Estrutura do Banco de Dados (DER)

O modelo de dados é composto pelas seguintes entidades principais:

| Entidade | Campos Chave (Exemplos) |
| :--- | :--- |
| **Equipamento** | `id`, `patrimonio` (UNIQUE), `nome`, `categoria`, `status` |
| **Usuario** | `id`, `email_institucional` (UNIQUE), `funcao`, `senha_hash` |
| **Emprestimo** | `id`, `id_equipamento` (FK), `id_responsavel` (FK), `data_retorno_prevista`, `status` |
| **Devolucao** | `id`, `id_emprestimo` (FK), `estado_conservacao_retorno`, `data_registro` |

##  Instalação e Configuração (Guia Rápido)

Para configurar e rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
*   **Java Development Kit (JDK) 21**
*   **MySQL Server** (versão 8.0 ou superior)
*   **Node.js** e **npm** (para o Front-end React)

### Back-end (Java)

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd nome-do-seu-projeto/backend
    ```
2.  **Configuração do Banco de Dados:**
    *   Crie um banco de dados MySQL.
    *   Atualize as credenciais de conexão no arquivo de configuração do projeto (ex: `application.properties` ou `application.yml`).
3.  **Compilação e Execução:**
    *   Utilize sua IDE (Intellij IDEA) ou ferramentas de build (Maven/Gradle) para compilar e iniciar o servidor.

### Front-end (React/Vite)

1.  **Navegue para o diretório do Front-end:**
    ```bash
    cd nome-do-seu-projeto/frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou porta similar, conforme configurado pelo Vite).

##  Contribuição

Instruções sobre como outros desenvolvedores podem contribuir para o seu projeto.

1.  Faça um fork do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`).
3.  Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`).
4.  Faça o push para a branch (`git push origin feature/NovaFeature`).
5.  Abra um Pull Request.



**Desenvolvido por:** [Lucas de Vasconcelos Barreira Carvalho]
**Data:** Novembro/2025

