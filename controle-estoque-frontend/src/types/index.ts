export interface Categoria {
  id: number;
  descricao: string;
  descricaoDetalhada: string;
}

export interface Produto {
  id: number;
  descricao: string;
  valor: number;
  quantidade: number;
  idCategoria: number;
  categoria?: Categoria;
}

export interface Usuario {
  user: string;
  Senha: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface MovimentacaoEstoque {
  id: number;
  idProduto: number;
  tipo: string;
  quantidade: number;
  data: string;
  observacao: string;
  produto?: Produto;
}
