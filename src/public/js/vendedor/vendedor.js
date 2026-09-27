const listaPedidosEl = document.querySelector(".painel__lista");

let pedidos;

window.onload = async () => {
  await buscarPedidos();
  renderizarPedidos();
};

async function buscarPedidos() {
  const response = await fetch(`${API_BASE_URL}/infos/pedidos`);
  const data = await response.json();

  console.log(data)

  pedidos = data.dados;
}

function renderizarPedidos() {
  if (pedidos.length === 0) {
    listaPedidosEl.innerHTML = "<p>Nenhum pedido!</p>";
    return;
  }

  listaPedidosEl.innerHTML = "";
  pedidos.forEach((pedido) => {
    listaPedidosEl.append(criarCardPedido(pedido));
  });
}

// Monta o card de um pedido: dados do cliente, itens (com complementos) e total
function criarCardPedido(pedido) {
  const card = document.createElement("section");
  card.classList.add("pedido");

  const info = document.createElement("div");
  info.classList.add("pedido__info");

  const nomeCliente = document.createElement("h3");
  nomeCliente.classList.add("pedido__cliente");
  nomeCliente.textContent = pedido.nome;

  const dataPedido = document.createElement("p");
  dataPedido.classList.add("pedido__data");
  dataPedido.textContent = pedido.data;

  info.append(nomeCliente, dataPedido);

  const listaItens = criarListaItens(pedido.itens);

  const total = document.createElement("p");
  total.classList.add("pedido__total");
  total.textContent = `TOTAL: R$${pedido.preco_total.toFixed(2).replace(".", ",")}`;

  const botaoConcluir = document.createElement("button");
  botaoConcluir.type = "button";
  // .botao/.botao--primario dão o estilo; .pedido__concluir é só o
  // gancho que o listener de clique usa para achar este botão.
  botaoConcluir.classList.add("botao", "botao--primario", "pedido__concluir");
  botaoConcluir.dataset.pedidoId = pedido.id_pedido;
  botaoConcluir.textContent = "Concluído";

  card.append(
    info,
    criarDivisor(),
    listaItens,
    criarDivisor(),
    total,
    botaoConcluir,
  );

  return card;
}

// Lista com um <li> por item e, dentro dele, uma sublista com os complementos
function criarListaItens(itens) {
  const lista = document.createElement("ul");
  lista.classList.add("pedido__lista-itens");

  itens.forEach((item) => {
    const liItem = document.createElement("li");
    liItem.classList.add("pedido__item");
    liItem.textContent = item.produto;

    // Só cria a sublista se houver complementos, para não deixar um <ul> vazio
    if (item.complementos && item.complementos.length > 0) {
      const listaComplementos = document.createElement("ul");
      listaComplementos.classList.add("pedido__complementos");

      item.complementos.forEach((complemento) => {
        const liComplemento = document.createElement("li");
        liComplemento.classList.add("pedido__complemento");
        liComplemento.textContent = complemento.nome;
        listaComplementos.append(liComplemento);
      });

      liItem.append(listaComplementos);
    }

    lista.append(liItem);
  });

  return lista;
}

function criarDivisor() {
  const hr = document.createElement("hr");
  hr.classList.add("pedido__divisor");
  hr.setAttribute("aria-hidden", "true"); // é só decoração, não conteúdo
  return hr;
}

// Delegação de evento: um único listener cuida de todos os botões
// "Concluído", mesmo os criados depois pelo JS.
listaPedidosEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button.pedido__concluir");
  if (!botao) return;

  pedidos = pedidos.filter((pedido) => pedido.id_pedido != botao.dataset.pedidoId);
  mostrarAviso("Pedido concluído com sucesso!");
  renderizarPedidos();
});