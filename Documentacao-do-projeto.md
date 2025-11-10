# Sistema de Controle de Estoque

Sistema completo de controle de estoque desenvolvido com arquitetura em camadas, utilizando .NET 8.0 (Backend) e React 18 com TypeScript (Frontend).

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)
- [Configurações](#configurações)
- [Scripts Úteis](#scripts-úteis)

## 🎯 Visão Geral

Sistema de gestão de estoque completo que permite:
- Gerenciamento de produtos e categorias
- Controle de movimentações de estoque (entradas e saídas)
- Geração de relatórios em PDF
- Dashboard com estatísticas em tempo real
- Sistema de autenticação JWT
- Alertas de estoque baixo

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas (Clean Architecture):

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│     Interface do Usuário            │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│      API Layer (Controllers)        │
│     Projeto2025_API                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                   │
│     Lógica de Negócio                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repository Layer                │
│     Acesso a Dados                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Database (MySQL)                │
│     Persistência de Dados            │
└──────────────────────────────────────┘
```

### Camadas do Backend

1. **Dominio**: Entidades e DTOs (Data Transfer Objects)
2. **Interface**: Contratos e interfaces dos serviços e repositórios
3. **Service**: Lógica de negócio e regras de validação
4. **InfraEstrutura**: Implementação de repositórios e acesso a dados (Entity Framework)
5. **Projeto2025_API**: Camada de apresentação (Controllers, Middleware, Validações)

## 🚀 Tecnologias

### Backend
- **.NET 8.0** - Framework principal
- **Entity Framework Core 9.0.8** - ORM para acesso a dados
- **MySQL** (Pomelo.EntityFrameworkCore.MySql) - Banco de dados
- **AutoMapper** - Mapeamento de objetos
- **FluentValidation** - Validação de dados
- **JWT Bearer** - Autenticação e autorização
- **Swagger/OpenAPI** - Documentação da API

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **jsPDF + jspdf-autotable** - Geração de PDFs
- **CSS3** - Estilização

## 📁 Estrutura do Projeto

```
Trabalho-C--main/
├── Dominio/                          # Camada de Domínio
│   ├── Entidades/
│   │   ├── Categoria.cs
│   │   ├── Produto.cs
│   │   └── MovimentacaoEstoque.cs
│   └── Dtos/
│       ├── CategoriaDto.cs
│       ├── ProdutoDto.cs
│       ├── MovimentacaoEstoqueDto.cs
│       ├── UsuarioDTO.cs
│       ├── RelatorioDto.cs
│       └── PagedResult.cs
│
├── Interface/                        # Contratos/Interfaces
│   ├── ICategoriaRepositorio.cs
│   ├── ICategoriaService.cs
│   ├── IProdutoRepositorio.cs
│   ├── IProdutoService.cs
│   ├── IMovimentacaoRepositorio.cs
│   ├── IMovimentacaoService.cs
│   └── IRelatorioService.cs
│
├── Service/                          # Camada de Serviços
│   ├── CategoriaService.cs
│   ├── ProdutoService.cs
│   ├── MovimentacaoService.cs
│   └── RelatorioService.cs
│
├── InfraEstrutura/                   # Camada de Infraestrutura
│   ├── Data/
│   │   ├── EmpresaContexto.cs       # DbContext do Entity Framework
│   │   └── ContextoEmpresaFactory.cs
│   ├── Repositorio/
│   │   ├── CategoriaRepositorio.cs
│   │   ├── ProdutoRepositorio.cs
│   │   └── MovimentacaoRepositorio.cs
│   ├── Migrations/                   # Migrações do Entity Framework
│   └── Scripts/
│       ├── create_database.sql
│       └── add_movimentacao_estoque.sql
│
├── Projeto2025_API/                 # Camada de Apresentação
│   ├── Controllers/
│   │   ├── CategoriaController.cs
│   │   ├── ProdutoController.cs
│   │   ├── MovimentacaoController.cs
│   │   ├── RelatorioController.cs
│   │   └── SegurancaController.cs
│   ├── Middleware/
│   │   └── GlobalExceptionMiddleware.cs
│   ├── Validation/
│   │   ├── CategoriaValidacao.cs
│   │   └── ProdutoValidacao.cs
│   ├── Mapping/
│   │   └── MappingProfile.cs
│   ├── Program.cs
│   └── appsettings.json
│
└── controle-estoque-frontend/       # Frontend React
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx
    │   │   ├── CategoriaForm.tsx
    │   │   └── ProdutoForm.tsx
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ProdutosPage.tsx
    │   │   ├── CategoriasPage.tsx
    │   │   ├── MovimentacoesPage.tsx
    │   │   └── RelatoriosPage.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── config.ts
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

## 📦 Pré-requisitos

- **.NET 8.0 SDK** ou superior
- **MySQL Server** 8.0 ou superior
- **Node.js** 16.x ou superior
- **npm** (incluído com Node.js)

## 🛠️ Instalação e Execução

### Opção 1: Script Automatizado (Recomendado)

Use o script PowerShell `init.ps1` para automatizar toda a configuração:

```powershell
# Inicialização completa
.\init.ps1

# Inicialização sem verificar MySQL
.\init.ps1 -SkipDbCheck

# Apenas build (sem executar)
.\init.ps1 -BuildOnly
```

O script verifica pré-requisitos, restaura dependências, compila o projeto e configura o banco de dados.

### Opção 2: Instalação Manual

#### 1. Configurar Banco de Dados MySQL

Execute o script SQL para criar o banco de dados:

```bash
mysql -u root -p < InfraEstrutura/Scripts/create_database.sql
```

Ou execute manualmente no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS dbEmpresa2025;
USE dbEmpresa2025;
-- O script cria as tabelas e insere dados de exemplo
```

#### 2. Configurar String de Conexão

Edite `Projeto2025_API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "default": "Server=localhost;Database=dbEmpresa2025;Uid=root;Pwd=sua_senha;"
  }
}
```

#### 3. Aplicar Migrações do Entity Framework

```bash
cd Projeto2025_API
dotnet ef database update --project ..\InfraEstrutura\InfraEstrutura.csproj --startup-project Projeto2025_API.csproj
```

#### 4. Executar Backend

```bash
cd Projeto2025_API
dotnet restore
dotnet build
dotnet run
```

O backend estará disponível em:
- **Swagger UI**: `http://localhost:5000/swagger`
- **API Base**: `http://localhost:5000/api`

#### 5. Executar Frontend

```bash
cd controle-estoque-frontend
npm install
npm start
```

O frontend estará disponível em:
- **Aplicação**: `http://localhost:3000`

### Executando no Visual Studio (Windows)

1. **Abrir a solução**: clique duas vezes em `Projeto2025_API.sln` ou, no Visual Studio, vá em `File > Open > Project/Solution` e selecione o arquivo na raiz do repositório.
2. **Configurar o backend**:
   - Confirme a string de conexão em `appsettings.json` (ou utilize *User Secrets* se preferir não versionar a senha).
   - No Solution Explorer, defina `Projeto2025_API` como *Startup Project*.
   - Se necessário, restaure pacotes com `Build > Restore NuGet Packages`.
3. **Executar backend**: pressione `F5` (Debug) ou `Ctrl+F5` (sem Debug). O Visual Studio compilará o projeto e abrirá o Swagger em `http://localhost:5000/swagger`.
4. **Executar frontend**:
   - Abra o **Terminal** integrado do Visual Studio (`View > Terminal` ou `Ctrl+``).
   - Rode os comandos:
     ```bash
     cd ..\controle-estoque-frontend
     npm install    # primeira vez
     npm start
     ```
   - O React iniciará em `http://localhost:3000`.
5. **Depuração**: mantendo o backend em *Debug* e o frontend com `npm start`, você pode definir breakpoints no código C# e inspecionar requisições via Swagger ou pela aplicação React.

### Executando no Visual Studio Code

1. **Abrir a pasta do projeto**: `File > Open Folder...` e selecione `Trabalho-C--main`.
2. **Extensões recomendadas**:
   - C# (Microsoft)
   - C# Dev Kit (opcional)
   - ESLint / Prettier (para o frontend)
3. **Terminais recomendados** (dois painéis):
   - **Terminal 1 (backend)**:
     ```bash
     cd Projeto2025_API
     dotnet restore
     dotnet watch run
     ```
     Isso compila e executa o backend com hot reload.
   - **Terminal 2 (frontend)**:
     ```bash
     cd controle-estoque-frontend
     npm install    # primeira vez
     npm start
     ```
4. **Debug no VS Code**:
   - Pressione `F5` e escolha o profile **.NET Launch** (crie um `launch.json` se solicitado).
   - Para o frontend, utilize `npm start`; o React já oferece hot reload.
5. **Variáveis de ambiente**: use arquivos `.env` (frontend) ou `dotnet user-secrets` (backend) para senhas de banco em ambientes de desenvolvimento.

## 🔌 API Endpoints

### Autenticação

#### `POST /api/Seguranca`
Realiza login e retorna token JWT.

**Request:**
```json
{
  "user": "ana",
  "Senha": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### `GET /api/Seguranca/token`
Gera token JWT para testes (sem necessidade de login).

---

### Categorias

Todos os endpoints requerem autenticação JWT.

- `GET /api/Categoria` - Lista todas as categorias
- `GET /api/Categoria/{id}` - Busca categoria por ID
- `GET /api/Categoria/{nome}` - Busca categorias por nome
- `POST /api/Categoria` - Cria nova categoria
- `PUT /api/Categoria` - Atualiza categoria
- `DELETE /api/Categoria/{id}` - Remove categoria

---

### Produtos

Todos os endpoints requerem autenticação JWT.

- `GET /api/Produto` - Lista todos os produtos
- `GET /api/Produto/{id}` - Busca produto por ID
- `GET /api/Produto/{nome}` - Busca produtos por nome
- `POST /api/Produto` - Cria novo produto
- `PUT /api/Produto` - Atualiza produto
- `DELETE /api/Produto/{id}` - Remove produto

---

### Movimentações

Todos os endpoints requerem autenticação JWT.

- `GET /api/Movimentacao` - Lista todas as movimentações
- `GET /api/Movimentacao/{id}` - Busca movimentação por ID
- `GET /api/Movimentacao/produto/{idProduto}` - Busca movimentações por produto
- `GET /api/Movimentacao/tipo/{tipo}` - Busca movimentações por tipo (Entrada/Saída)
- `POST /api/Movimentacao` - Cria nova movimentação
- `DELETE /api/Movimentacao/{id}` - Remove movimentação

---

### Relatórios

Todos os endpoints requerem autenticação JWT.

- `GET /api/Relatorio/sintetico` - Relatório sintético (dashboard)
- `GET /api/Relatorio/movimentacoes?dataInicio={data}&dataFim={data}` - Relatório de movimentações por período
- `GET /api/Relatorio/categorias` - Relatório por categorias
- `GET /api/Relatorio/produtos` - Relatório detalhado de produtos

## ✨ Funcionalidades

### Backend

- ✅ **CRUD Completo** de Categorias, Produtos e Movimentações
- ✅ **Autenticação JWT** com expiração de 120 minutos
- ✅ **Validações** com FluentValidation
- ✅ **Tratamento Global de Exceções** via Middleware
- ✅ **Logging Estruturado**
- ✅ **Paginação** para grandes volumes de dados
- ✅ **Relacionamentos** entre entidades com restrições
- ✅ **Relatórios** com cálculos agregados
- ✅ **Documentação Swagger** completa

### Frontend

- ✅ **Dashboard** com estatísticas em tempo real
- ✅ **Gestão de Produtos** (CRUD completo)
- ✅ **Gestão de Categorias** (CRUD completo)
- ✅ **Gestão de Movimentações** (entradas e saídas)
- ✅ **Sistema de Autenticação** com JWT
- ✅ **Busca** em produtos e categorias
- ✅ **Relatórios** com exportação para PDF
- ✅ **Alertas** de produtos com estoque baixo (< 10 unidades)
- ✅ **Interface Responsiva** para diferentes tamanhos de tela
- ✅ **Validações de Formulário** em tempo real

### Relatórios

O sistema gera 4 tipos de relatórios:

1. **Relatório Sintético**: Visão geral do estoque
   - Total de produtos
   - Produtos sem estoque
   - Produtos com estoque baixo (< 10 unidades)
   - Valor total do estoque
   - Movimentações do dia

2. **Relatório de Movimentações**: Análise de entradas e saídas por período
   - Total de movimentações
   - Total de entradas
   - Total de saídas
   - Detalhamento de cada movimentação

3. **Relatório por Categorias**: Análise do estoque agrupado por categoria
   - Total de produtos por categoria
   - Quantidade total em estoque
   - Valor total por categoria

4. **Relatório de Produtos**: Análise detalhada de cada produto
   - Status do estoque (Normal, Estoque Baixo, Sem Estoque)
   - Valor unitário e total
   - Categoria de cada produto

Todos os relatórios podem ser exportados para **PDF**.

## ⚙️ Configurações

### CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:3000`
- `https://localhost:3000`
- `http://localhost:3001`
- `https://localhost:3001`

### JWT

Configurações no `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "AAAAAAAAAACCCCCCCCCCBBBBBBBBBB22",
    "Issuer": "AlgumIssuer",
    "Audience": "AlgumaAudience"
  }
}
```

- **Expiração**: 120 minutos (2 horas)
- **Algoritmo**: HS256

### Banco de Dados

- **SGBD**: MySQL 8.0+
- **Charset**: UTF-8
- **Relacionamentos**: 
  - Produto → Categoria (Many-to-One)
  - Movimentacao → Produto (Many-to-One)
- **Restrições**: ON DELETE RESTRICT para manter integridade

### Estoque Baixo

O sistema considera estoque baixo quando a quantidade é:
- **Maior que 0** (não está sem estoque)
- **Menor que 10** unidades

Este limite pode ser ajustado no código do `RelatorioService.cs`.

## 🔐 Credenciais de Acesso

**Usuário padrão:**
- **Usuário**: `ana`
- **Senha**: `123456`

## 📜 Scripts Úteis

### Script de Inicialização (`init.ps1`)

Script PowerShell que automatiza a inicialização do projeto:

```powershell
# Executa verificação de pré-requisitos, build e configuração
.\init.ps1

# Pula verificação de MySQL
.\init.ps1 -SkipDbCheck

# Apenas build, sem executar
.\init.ps1 -BuildOnly
```

### Comandos Úteis

**Backend:**
```bash
# Restaurar dependências
dotnet restore

# Compilar projeto
dotnet build

# Executar projeto
dotnet run

# Aplicar migrações
dotnet ef database update --project ..\InfraEstrutura\InfraEstrutura.csproj --startup-project Projeto2025_API.csproj

# Criar nova migração
dotnet ef migrations add NomeDaMigracao --project ..\InfraEstrutura\InfraEstrutura.csproj --startup-project Projeto2025_API.csproj
```

**Frontend:**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 🐛 Troubleshooting

### Backend não inicia

1. Verifique se o MySQL está rodando
2. Confirme a string de conexão no `appsettings.json`
3. Verifique se as migrações foram aplicadas
4. Veja os logs no console para erros específicos

### Frontend não conecta com a API

1. Verifique se o backend está rodando na porta 5000
2. Confirme as configurações de CORS
3. Verifique se o token JWT está sendo enviado nas requisições
4. Abra o console do navegador (F12) para ver erros

### Erro ao gerar PDF

1. Verifique se as dependências `jspdf` e `jspdf-autotable` estão instaladas
2. Execute `npm install` novamente
3. Reinicie o servidor de desenvolvimento

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.

## 👥 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação do Swagger em `http://localhost:5000/swagger`

---

**Desenvolvido com ❤️ usando .NET e React**
