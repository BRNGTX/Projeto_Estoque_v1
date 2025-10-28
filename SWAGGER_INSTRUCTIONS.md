# 🔐 Como Usar a Autenticação JWT no Swagger

## 📋 Instruções Passo a Passo

### 1. **Obter o Token JWT**
- Acesse o Swagger: `https://localhost:7000/swagger`
- Vá para a seção **Seguranca**
- Execute o endpoint **GET** `/api/Seguranca/token`
- Copie o valor do campo `access_token` da resposta

### 2. **Configurar Autenticação no Swagger**
- No Swagger UI, clique no botão **"Authorize"** (🔒) no canto superior direito
- Cole apenas o valor do `access_token` (sem "Bearer")
- Clique em **"Authorize"**
- Clique em **"Close"**

### 3. **Testar Endpoints Protegidos**
- Agora você pode testar todos os endpoints que requerem autenticação
- Os endpoints de **Categoria** e **Produto** estão protegidos
- O Swagger automaticamente incluirá o token nas requisições

## 🚀 Endpoints Disponíveis

### **Seguranca** (Sem autenticação)
- `POST /api/Seguranca` - Login com credenciais
- `GET /api/Seguranca/token` - **Obter token para testes** ⭐

### **Categoria** (Requer autenticação)
- `GET /api/Categoria/{id}` - Buscar categoria por ID
- `POST /api/Categoria` - Criar nova categoria
- `PUT /api/Categoria` - Atualizar categoria
- `DELETE /api/Categoria/{id}` - Excluir categoria
- `GET /api/Categoria/{nome}` - Buscar categorias por nome

### **Produto** (Requer autenticação)
- `GET /api/Produto/{id}` - Buscar produto por ID
- `POST /api/Produto` - Criar novo produto
- `PUT /api/Produto` - Atualizar produto
- `DELETE /api/Produto/{id}` - Excluir produto
- `GET /api/Produto/{nome}` - Buscar produtos por nome

## 🔑 Credenciais de Login (se usar POST)
- **Usuário**: `ana`
- **Senha**: `123456`

## ⚠️ Importante
- O token expira em **120 minutos**
- Se receber erro 401, gere um novo token
- Use sempre o endpoint **GET /api/Seguranca/token** para testes rápidos



