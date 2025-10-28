# Controle de Estoque - Frontend

Sistema de controle de estoque desenvolvido em React com TypeScript.

## Funcionalidades

- **Dashboard**: Visão geral do estoque com estatísticas importantes
- **Gestão de Produtos**: CRUD completo de produtos
- **Gestão de Categorias**: CRUD completo de categorias
- **Autenticação**: Sistema de login com JWT
- **Busca**: Funcionalidade de busca em produtos e categorias
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela

## Tecnologias Utilizadas

- React 18
- TypeScript
- React Router DOM
- Axios
- CSS3

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm start
```

3. Acesse no navegador:
```
http://localhost:3000
```

## Credenciais de Acesso

- **Usuário**: ana
- **Senha**: 123456

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal com navegação
│   ├── CategoriaForm.tsx
│   └── ProdutoForm.tsx
├── pages/              # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProdutosPage.tsx
│   └── CategoriasPage.tsx
├── services/           # Serviços de API
│   └── api.ts
├── types/             # Definições de tipos TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
├── index.tsx          # Ponto de entrada
└── index.css          # Estilos globais
```

## API Backend

Este frontend consome a API desenvolvida em .NET Core, que deve estar rodando em:
```
https://localhost:7000
```

## Funcionalidades Principais

### Dashboard
- Total de produtos cadastrados
- Valor total do estoque
- Produtos com baixo estoque (quantidade < 10)
- Lista dos produtos mais caros

### Gestão de Produtos
- Listar todos os produtos
- Criar novo produto
- Editar produto existente
- Excluir produto
- Buscar produtos por nome ou categoria
- Exibir informações da categoria associada

### Gestão de Categorias
- Listar todas as categorias
- Criar nova categoria
- Editar categoria existente
- Excluir categoria
- Buscar categorias por nome ou descrição

### Autenticação
- Login com usuário e senha
- Armazenamento do token JWT
- Redirecionamento automático para login quando não autenticado
- Logout com limpeza do token

## Validações

- Campos obrigatórios são validados
- Valores numéricos têm validação de mínimo
- Tamanhos máximos de campos respeitados
- Confirmação antes de excluir registros
