# Sistema de Controle de Estoque

Sistema completo de controle de estoque desenvolvido com .NET Core (Backend) e React (Frontend).

## 🚀 Tecnologias Utilizadas

### Backend (.NET Core)
- **.NET 8.0**
- **Entity Framework Core 9.0.8**
- **MySQL** (Pomelo.EntityFrameworkCore.MySql)
- **AutoMapper** para mapeamento de objetos
- **FluentValidation** para validações
- **JWT Bearer** para autenticação
- **Swagger** para documentação da API

### Frontend (React)
- **React 18** com TypeScript
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **CSS3** para estilização

## 📁 Estrutura do Projeto

```
Trabalho-C--main/
├── Dominio/                    # Entidades e DTOs
│   ├── Entidades/
│   │   ├── Categoria.cs
│   │   └── Produto.cs
│   └── Dtos/
│       ├── CategoriaDto.cs
│       ├── ProdutoDto.cs
│       ├── UsuarioDTO.cs
│       └── PagedResult.cs
├── InfraEstrutura/            # Camada de infraestrutura
│   ├── Data/
│   │   ├── EmpresaContexto.cs
│   │   └── ContextoEmpresaFactory.cs
│   ├── Repositorio/
│   │   ├── CategoriaRepositorio.cs
│   │   └── ProdutoRepositorio.cs
│   └── Scripts/
│       └── create_database.sql
├── Interface/                  # Contratos/Interfaces
│   ├── ICategoriaRepositorio.cs
│   ├── ICategoriaService.cs
│   ├── IProdutoRepositorio.cs
│   └── IProdutoService.cs
├── Service/                    # Lógica de negócio
│   ├── CategoriaService.cs
│   └── ProdutoService.cs
├── Projeto2025_API/           # API Web
│   ├── Controllers/
│   │   ├── CategoriaController.cs
│   │   ├── ProdutoController.cs
│   │   └── SegurancaController.cs
│   ├── Middleware/
│   │   └── GlobalExceptionMiddleware.cs
│   ├── Validation/
│   │   ├── CategoriaValidacao.cs
│   │   └── ProdutoValidacao.cs
│   ├── Mapping/
│   │   └── MappingProfile.cs
│   └── Program.cs
└── controle-estoque-frontend/  # Frontend React
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    └── package.json
```

## 🛠️ Como Executar

### Pré-requisitos
- .NET 8.0 SDK
- MySQL Server
- Node.js (para o frontend)

### Backend

1. **Configure o MySQL:**
   ```sql
   -- Execute o script SQL
   mysql -u root -p < InfraEstrutura/Scripts/create_database.sql
   ```

2. **Configure a string de conexão** no `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "default": "Server=localhost;Database=dbEmpresa2025;Uid=root;Pwd=sua_senha;"
     }
   }
   ```

3. **Execute o projeto:**
   ```bash
   cd Projeto2025_API
   dotnet run
   ```

4. **Acesse a API:**
   - Swagger: `https://localhost:7000/swagger`
   - API Base: `https://localhost:7000/api`

### Frontend

1. **Instale as dependências:**
   ```bash
   cd controle-estoque-frontend
   npm install
   ```

2. **Execute o projeto:**
   ```bash
   npm start
   ```

3. **Acesse a aplicação:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciais de Acesso

- **Usuário:** ana
- **Senha:** 123456

## 📋 Funcionalidades

### Backend
- ✅ CRUD completo de Categorias
- ✅ CRUD completo de Produtos
- ✅ Autenticação JWT
- ✅ Validações com FluentValidation
- ✅ Tratamento global de exceções
- ✅ Logging estruturado
- ✅ Paginação
- ✅ Relacionamento entre Produtos e Categorias
- ✅ Documentação com Swagger

### Frontend
- ✅ Dashboard com estatísticas do estoque
- ✅ Gestão de Produtos (CRUD)
- ✅ Gestão de Categorias (CRUD)
- ✅ Sistema de autenticação
- ✅ Busca em produtos e categorias
- ✅ Interface responsiva
- ✅ Alertas de produtos com baixo estoque
- ✅ Validações de formulário

## 🎯 Principais Melhorias Implementadas

1. **Migração para MySQL** - Substituição do SQL Server por MySQL
2. **Validações Robustas** - Validações customizadas e assíncronas
3. **Tratamento de Exceções** - Middleware global para tratamento de erros
4. **Paginação** - Sistema de paginação para grandes volumes de dados
5. **Logging Estruturado** - Logs organizados e informativos
6. **Segurança** - CORS configurado adequadamente
7. **Frontend Completo** - Interface moderna e funcional

## 🔧 Configurações Importantes

### CORS
O backend está configurado para aceitar requisições do frontend em:
- `http://localhost:3000`
- `https://localhost:3000`

### JWT
- **Chave:** Configurada no `appsettings.json`
- **Issuer/Audience:** Configurados para autenticação
- **Expiração:** 120 minutos

### Banco de Dados
- **MySQL** com charset UTF-8
- **Relacionamentos** com restrição de exclusão
- **Índices** para melhor performance

## 📊 Dashboard

O dashboard apresenta:
- Total de produtos cadastrados
- Valor total do estoque
- Produtos com baixo estoque (< 10 unidades)
- Lista dos produtos mais caros

## 🚨 Alertas

O sistema identifica automaticamente:
- Produtos com quantidade menor que 10 unidades
- Validações de campos obrigatórios
- Erros de conexão com a API

## 🔄 Próximos Passos Sugeridos

1. **Testes Unitários** - Implementar testes para serviços e repositórios
2. **Cache** - Implementar cache Redis para melhor performance
3. **Relatórios** - Adicionar geração de relatórios em PDF/Excel
4. **Notificações** - Sistema de notificações em tempo real
5. **Backup** - Sistema automático de backup do banco de dados
6. **Auditoria** - Log de alterações nos registros
7. **API Versioning** - Versionamento da API para futuras atualizações

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração.
