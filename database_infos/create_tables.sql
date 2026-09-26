-- Nome do banco de dados: sistema_acai

DROP TABLE IF EXISTS public.itens_pedido_complemento, public.itens_pedido, public.produtos, public.complementos, public.pedidos;

CREATE TABLE public.produtos (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tamanho VARCHAR(50),
  descricao VARCHAR(500),
  preco DECIMAL(5,2) NOT NULL,
  pode_complementos BOOLEAN NOT NULL DEFAULT FALSE,
  imagem VARCHAR(50) NOT NULL
);

CREATE TABLE public.complementos (
  id_complemento SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(5,2) NOT NULL
);

CREATE TABLE public.pedidos (
  id_pedido SERIAL PRIMARY KEY,
  nome_cliente VARCHAR(255) NOT NULL,
  data TIMESTAMP NOT NULL DEFAULT NOW(),
  preco_total DECIMAL(5,2) NOT NULL
);

CREATE TABLE public.itens_pedido (
  id_item SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE public.itens_pedido_complemento (
  id_item INT NOT NULL,
  id_complemento INT NOT NULL,
  PRIMARY KEY (id_item, id_complemento),
  FOREIGN KEY (id_item) REFERENCES itens_pedido(id_item),
  FOREIGN KEY (id_complemento) REFERENCES complementos(id_complemento)
);