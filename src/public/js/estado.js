// Variável de estado para controle
let estado = {
  produtos: [],
  complementos: [],

  produtoSelecionado: null,
  complementosSelecionados: [],
  precoTotal: 0,

  carrinho:
    localStorage.getItem("carrinho") != undefined
    ? JSON.parse(localStorage.getItem("carrinho"))
    : [],
};

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(estado.carrinho));
}