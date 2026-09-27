const modalEl = document.querySelector(".modal");
const cardsContainerEl = document.querySelector(".cards");
const modalImagemEl = document.querySelector(".modal__imagem");
const modalNomeEl = document.querySelector(".modal__nome");
const modalDescricaoEl = document.querySelector(".modal__descricao");
const modalPrecoEl = document.querySelector(".modal__preco");
const modalComplementosEl = document.querySelector(".modal__complementos");

// Quando a tela é carregada:
// - Busca e salva as informações dos produtos e dos complementos
// - Renderiza os cards dos produtos
window.onload = async () => {
  const dados = await buscarInformacoesDaAPI();
  estado.produtos = dados[0]
  estado.complementos = dados[1]
  renderizarCardProdutos();
};

// Renderiza um card novo para cada produto
function renderizarCardProdutos() {
  estado.produtos.forEach((produto) => {
    cardsContainerEl.append(criarCard(produto));
  });
}

// Cria todos os elementos do card com as informações do produto
function criarCard(produto) {
  const card = document.createElement("article");
  card.classList.add("produto-card");

  const figure = document.createElement("figure");
  figure.classList.add("produto-card__figura");

  const imagem = document.createElement("img");
  imagem.classList.add("produto-card__imagem");
  imagem.src = `/images/produtos/${produto.id_produto}.png`;
  imagem.alt = produto.nome;

  figure.append(imagem);

  const info = document.createElement("section");
  info.classList.add("produto-card__info");

  const nome = document.createElement("h2");
  nome.classList.add("produto-card__nome");
  nome.textContent = produto.nome;

  const tamanho = document.createElement("p");
  tamanho.classList.add("produto-card__tamanho");
  tamanho.textContent = produto.tamanho;

  const preco = document.createElement("p");
  preco.classList.add("produto-card__preco");
  preco.textContent = `R$${produto.preco}`;

  const footer = document.createElement("footer");
  footer.classList.add("produto-card__footer");

  const botaoAdicionar = document.createElement("button");
  botaoAdicionar.type = "button";
  botaoAdicionar.classList.add("botao", "botao--primario");
  botaoAdicionar.textContent = "Adicionar";
  botaoAdicionar.addEventListener("click", () => adicionar(produto));

  footer.append(preco, botaoAdicionar);
  info.append(nome, tamanho, footer);
  card.append(figure, info);

  return card;
}

function abrirModal() {
  preencherModal();
  modalEl.showModal();
}

function fecharModal() {
  modalEl.close();
  estado.produtoSelecionado = null;
  estado.complementosSelecionados = [];
  estado.precoTotal = 0;
  modalComplementosEl.innerHTML = "";
}

// Quando um produto for adicionado:
// - Salva na variável de estado
// - Se pode ter complementos, abre o modal para o usuário escolher
// - Se não, adiciona direto ao carrinho
function adicionar(produto) {
  estado.produtoSelecionado = produto;
  estado.precoTotal = calcularPrecoTotalItem();

  if (produto.pode_complementos === true) {
    abrirModal();
  } else {
    confirmarAdd();
  }
}

// Preenche o modal com as informações do produto e a lista de complementos
function preencherModal() {
  modalImagemEl.src = `/images/produtos/${estado.produtoSelecionado.id_produto}.png`;
  modalNomeEl.textContent = estado.produtoSelecionado.nome;
  modalDescricaoEl.textContent = estado.produtoSelecionado.descricao;
  atualizarDisplayPreco();

  estado.complementos.forEach((complemento) => {
    modalComplementosEl.append(criarOpcaoComplemento(complemento));
  });
}

// Cria uma opção de complemento (checkbox + nome + preço) para o modal
function criarOpcaoComplemento(complemento) {
  const opcao = document.createElement("label");
  opcao.classList.add("complemento");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.complementoId = complemento.id_complemento;

  const nome = document.createElement("span");
  nome.classList.add("complemento__nome");
  nome.textContent = complemento.nome;

  const preco = document.createElement("span");
  preco.classList.add("complemento__preco");
  preco.textContent = `+ R$${complemento.preco.replace(".", ",")}`;

  opcao.append(checkbox, nome, preco);

  return opcao;
}

// Adiciona o produto e os complementos escolhidos ao carrinho, e fecha o modal
function confirmarAdd() {
  const item = {
    produto: estado.produtoSelecionado,
    complementos: estado.complementosSelecionados,
    precoTotalItem: estado.precoTotal,
  };

  estado.carrinho.push(item);
  salvarCarrinho();
  fecharModal();
  mostrarAviso("Produto adicionado ao carrinho!");
}

function atualizarDisplayPreco() {
  modalPrecoEl.textContent = `R$${estado.precoTotal}`;
}

function calcularPrecoTotalItem() {
  let precoTotal = parseFloat(estado.produtoSelecionado.preco);

  estado.complementosSelecionados.forEach((complemento) => {
    precoTotal += parseFloat(complemento.preco);
  });

  return precoTotal.toFixed(2);
}

// Delegação de evento: um único listener cuida de todos os checkboxes,
// mesmo os criados depois pelo JS em preencherModal.
modalComplementosEl.addEventListener("change", (evento) => {
  if (!evento.target.matches("input[type='checkbox']")) return;

  const complemento = estado.complementos.find(
    (c) => c.id_complemento === Number(evento.target.dataset.complementoId),
  );

  if (evento.target.checked) {
    estado.complementosSelecionados.push(complemento);
  } else {
    estado.complementosSelecionados = estado.complementosSelecionados.filter(
      (item) => item.id_complemento !== complemento.id_complemento,
    );
  }

  atualizarPreco();
});

function atualizarPreco() {
  estado.precoTotal = calcularPrecoTotalItem();
  atualizarDisplayPreco();
}