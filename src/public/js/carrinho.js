window.onload = () => {
  renderizarCarrinho();
};

function renderizarCarrinho() {
  if (estado.carrinho === null || estado.carrinho.length === 0) {
    document.querySelector(".itens").innerHTML =
      '<p class="default">Carrinho vazio</p>';
    renderizarTotalCarrinho()
  } else {
    renderizarTotalCarrinho()
    document.querySelector(".itens").innerHTML = "";
    estado.carrinho.forEach((item) => {
      document.querySelector(".itens").append(criarCardItem(item));
    });
  }
}

function criarCardItem(item) {
  const item_card = document.createElement("div");
  item_card.classList.add("item");

  const item_infos = document.createElement("div");
  item_infos.classList.add("item-infos");

  const h4_nome = document.createElement("h4");
  h4_nome.innerText = item.produto.nome;

  const ul = document.createElement("ul");

  item.complementos.forEach((complemento) => {
    const li = document.createElement("li");
    li.innerText = complemento.nome;
    ul.append(li);
  });

  item_infos.append(h4_nome, ul);

  const button_excluir = document.createElement("button");
  button_excluir.classList.add("btn-excluir");
  button_excluir.dataset.itemId = estado.carrinho.indexOf(item);
  button_excluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

  item_card.append(item_infos, button_excluir);

  return item_card;
}

function calcularTotalCarrinho() {
  let total = 0;

  if (estado.carrinho != null) {
    estado.carrinho.forEach((item) => {
      total += parseFloat(item.precoTotalItem);
    });
  }

  return total.toFixed(2);
}

function renderizarTotalCarrinho() {
  const total = calcularTotalCarrinho();
  document.querySelector("#total").innerText = `R$${total.replace(".", ",")}`;
}

function esvaziarCarrinho() {
  localStorage.removeItem("carrinho");
  estado.carrinho = [];
  renderizarCarrinho();
}
function finalizarPedido() {
  if (estado.carrinho.length == 0) {
    mostrarAviso(2);
  } else {
    esvaziarCarrinho();
    mostrarAviso(1);
  }
}

document.querySelector(".itens").addEventListener("click", (e) => {
  const botao = e.target.closest("button.btn-excluir");
  if (botao) {
    removerItem(botao.dataset.itemId);
  }
});

function removerItem(id) {
  estado.carrinho = estado.carrinho.filter((i, index) => index != id);
  localStorage.setItem("carrinho", JSON.stringify(estado.carrinho));
  renderizarCarrinho();
}
