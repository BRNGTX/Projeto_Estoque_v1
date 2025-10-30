USE dbEmpresa2025;

CREATE TABLE IF NOT EXISTS MovimentacaoEstoque (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IdProduto INT NOT NULL,
    Tipo VARCHAR(50) NOT NULL,
    Quantidade INT NOT NULL,
    Data DATETIME(6) NOT NULL,
    Observacao TEXT,
    FOREIGN KEY (IdProduto) REFERENCES Produto(Id) ON DELETE RESTRICT,
    INDEX IX_MovimentacaoEstoque_IdProduto (IdProduto)
);







