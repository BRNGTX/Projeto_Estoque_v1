-- Script para criar o banco de dados MySQL
CREATE DATABASE IF NOT EXISTS dbEmpresa2025;
USE dbEmpresa2025;

-- Tabela Categoria
CREATE TABLE IF NOT EXISTS Categoria (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(150) NOT NULL,
    DescricaoDetalhada TEXT NOT NULL
);

-- Tabela Produto
CREATE TABLE IF NOT EXISTS Produto (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(150) NOT NULL,
    Valor DECIMAL(8,2) NOT NULL,
    Quantidade INT NOT NULL,
    IdCategoria INT NOT NULL,
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(Id) ON DELETE RESTRICT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS IX_Produto_IdCategoria ON Produto(IdCategoria);
CREATE INDEX IF NOT EXISTS IX_Categoria_Descricao ON Categoria(Descricao);

-- Inserir dados de exemplo
INSERT INTO Categoria (Descricao, DescricaoDetalhada) VALUES 
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Roupas', 'Vestuário e acessórios'),
('Livros', 'Livros e materiais educacionais'),
('Casa e Jardim', 'Produtos para casa e jardim'),
('Esportes', 'Equipamentos e acessórios esportivos');

INSERT INTO Produto (Descricao, Valor, Quantidade, IdCategoria) VALUES 
('Smartphone Samsung Galaxy', 1299.99, 15, 1),
('Notebook Dell Inspiron', 2499.99, 8, 1),
('Camiseta Polo', 89.90, 50, 2),
('Calça Jeans', 159.90, 30, 2),
('Livro de Programação', 79.90, 25, 3),
('Aspirador de Pó', 299.90, 12, 4),
('Bola de Futebol', 45.90, 20, 5),
('Tênis Esportivo', 199.90, 18, 5);
