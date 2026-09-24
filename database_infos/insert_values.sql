TRUNCATE TABLE itens_pedido_complemento, itens_pedido, complementos, pedidos, produtos RESTART IDENTITY CASCADE;

INSERT INTO public.produtos (nome, tamanho, descricao, preco, pode_complementos, imagem) 
VALUES
('Copo Tradicional 300mL', '300mL', 'Açaí cremoso e gelado feito na hora, do jeito que você manda. Escolha seus adicionais e monte a combinação perfeita.', 19.90, true, 'copo300.png'),
('Copo Tradicional 500mL', '500mL', 'Mais açaí, mais prazer. Cremoso, gelado e do seu jeito — com os adicionais que você amar. O tamanho certo pra saciar de verdade.', 24.90, true, 'copo500.png'),
('Marmita pra Família', '900mL', 'Açaí cremoso para todo mundo aproveitar. Ideal para compartilhar com a família ou matar aquela vontade enorme. Monte com os adicionais que quiser.', 42.90, true, 'marmita.png'),
('Shake na Garrafa', '300mL', 'Açaí batido com leite e leite condensado — cremoso, docinho e irresistível. Vem numa garrafa perfeita para levar onde quiser.', 24.90, true, 'shake.png'),
('Açai Trufado de Chocolate', '1L', 'O sabor inconfundível do açaí em formato de sorvete artesanal. Um pote generoso, perfeito para levar pra casa e repetir quantas vezes quiser.', 45.00, false, 'sorvete.png'),
('Brownie', '80g', 'Crocante por fora, com uma massa densa, úmida e intensamente chocolatuda por dentro. Um brownie que não decepciona — em nenhuma hora do dia.', 9.00, false, 'brownie.png'),
('Cookie Americano', '80g', 'Crocante por fora, macio por dentro e recheado com gotas de chocolate nobre que derretem a cada mordida. Simples assim, impossível comer só um.', 9.00, false, 'cookie.png'),
('Água sem gás', '500mL', 'Água mineral pura e gelada para refrescar na medida certa. O acompanhamento perfeito para qualquer pedido.', 5.00, false, 'agua_s_gas.jpeg'),
('Água com gás', '500mL', 'Água mineral com aquela borbulha refrescante que faz toda diferença. Gelada e pronta para complementar seu pedido.', 5.00, false, 'agua_c_gas.jpeg'),
('Coca-Cola', '350mL', 'Gelada do jeito que você gosta. O clássico que combina com tudo.', 7.00, false, 'cocacola.jpeg');

INSERT INTO public.complementos (nome, preco)
VALUES
('Granola', 2.00),
('Paçoca', 2.00),
('Morango', 3.00),
('Leite em pó', 2.00),
('Leite condensado', 2.00),
('Uva', 3.00),
('Ovomaltine', 2.00),
('Creme de avelã', 4.00),
('Creme de ninho', 4.00),
('Creme de morango', 4.00),
('Chocolate em pó', 2.00),
('Banana', 3.00);

INSERT INTO public.pedidos (nome_cliente, preco_total, data)
VALUES
('Kauã Neto', 33.90, '2026-06-15 17:20:00'),
('Flávia Moreira Rabelo', 59.00, '2026-06-10 12:45:00'),
('Camila Mourão de Oliveira', 74.80, '2026-06-01 08:30:00'),
('João Tavares de Almeida', 28.90, '2026-06-22 09:10:00'),
('Carla Maria de Souza', 32.90, '2026-06-29 21:55:00');

INSERT INTO public.itens_pedido (id_pedido, id_produto, quantidade)
VALUES
(1, 1, 1),
(1, 7, 1),
(2, 5, 1),
(2, 6, 1),
(2, 9, 1),
(3, 2, 1),
(3, 2, 1),
(4, 2, 1),
(5, 2, 1),
(5, 9, 1);

INSERT INTO public.itens_pedido_complemento (id_item, id_complemento)
VALUES
(1, 3),
(1, 4),
(6, 8),
(6, 2),
(7, 3),
(7, 5),
(8, 4),
(8, 1),
(9, 3);
