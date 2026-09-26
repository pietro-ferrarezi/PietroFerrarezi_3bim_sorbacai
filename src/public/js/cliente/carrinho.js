const listaItensEl = document.querySelector(".carrinho__itens");
const totalEl = document.querySelector(".carrinho__total");

window.onload = () => {
  renderizarCarrinho();
};

// Redesenha a lista de itens e o total a partir de estado.carrinho.
// Chamada sempre que o carrinho muda: no load, ao excluir e ao esvaziar.
function renderizarCarrinho() {
  renderizarTotalCarrinho();

  const carrinhoVazio = !estado.carrinho || estado.carrinho.length === 0;

  if (carrinhoVazio) {
    listaItensEl.innerHTML = '<p class="carrinho__vazio">Carrinho vazio</p>';
    return;
  }

  listaItensEl.innerHTML = "";
  estado.carrinho.forEach((item, indice) => {
    listaItensEl.append(criarCardItem(item, indice));
  });
}

// Monta o card de um item. O índice vem de quem chama (renderizarCarrinho),
// em vez de cada card recalcular sua posição com indexOf.
function criarCardItem(item, indice) {
  const card = document.createElement("div");
  card.classList.add("item-carrinho");

  const infos = document.createElement("div");
  infos.classList.add("item-carrinho__infos");

  const nome = document.createElement("h3");
  nome.classList.add("item-carrinho__nome");
  nome.textContent = item.produto.nome;
  infos.append(nome);

  // Só cria a lista se houver complementos, para não deixar um <ul> vazio no card.
  if (item.complementos.length > 0) {
    const lista = document.createElement("ul");
    lista.classList.add("item-carrinho__complementos");

    item.complementos.forEach((complemento) => {
      const li = document.createElement("li");
      li.classList.add("item-carrinho__complemento");
      li.textContent = complemento.nome;
      lista.append(li);
    });

    infos.append(lista);
  }

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.classList.add("item-carrinho__excluir");
  botaoExcluir.dataset.itemId = indice;
  botaoExcluir.setAttribute("aria-label", `Remover ${item.produto.nome}`);
  botaoExcluir.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';

  card.append(infos, botaoExcluir);

  return card;
}

// Soma o preço de todos os itens. Retorna string com 2 casas (ex.: "42.50").
function calcularTotalCarrinho() {
  let total = 0;

  if (estado.carrinho) {
    estado.carrinho.forEach((item) => {
      total += parseFloat(item.precoTotalItem);
    });
  }

  return total.toFixed(2);
}

function renderizarTotalCarrinho() {
  const total = calcularTotalCarrinho();
  totalEl.textContent = `R$${total.replace(".", ",")}`;
}

function esvaziarCarrinho() {
  localStorage.removeItem("carrinho");
  estado.carrinho = [];
  renderizarCarrinho();
}

function finalizarPedido() {
  if (estado.carrinho.length === 0) {
    mostrarAviso("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.", true);
    return;
  }

  esvaziarCarrinho();
  mostrarAviso("Pedido finalizado com sucesso!");
}

// Delegação de evento: um único listener no container cuida de todos os
// botões de excluir, mesmo os criados depois pelo JS.
listaItensEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button.item-carrinho__excluir");
  if (botao) {
    removerItem(botao.dataset.itemId);
  }
});

function removerItem(id) {
  estado.carrinho = estado.carrinho.filter((item, indice) => indice != id);
  localStorage.setItem("carrinho", JSON.stringify(estado.carrinho));
  renderizarCarrinho();
}