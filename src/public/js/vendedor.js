window.onload =  async () => {
  await buscarPedidos()
  renderizarPedidos()
}

let pedidos

async function buscarPedidos() {
  const response = await fetch("http://localhost:3040/infos/pedidos")
  const data = await response.json()

  pedidos = data.pedidos
}

function renderizarPedidos() {
  if (pedidos.length != 0) {
    document.querySelector(".pedidos").innerHTML = ""
    pedidos.forEach(pedido => {
      document.querySelector(".pedidos").append(criarCardPedido(pedido))
    });
  } else {
    document.querySelector(".pedidos").innerHTML = "<p>Nenhum pedido!</p>"
  }
}

function criarCardPedido(pedido) {
  const card = document.createElement("section")
  card.classList.add("pedido")

  const nome_cliente = document.createElement("h4")
  nome_cliente.innerText = pedido.nome
  const data_pedido = document.createElement("p")
  data_pedido.innerText = pedido.data

  const card_infos = document.createElement("div")
  card_infos.classList.add("pedido_infos")
  card_infos.append(nome_cliente, data_pedido)

  const hr1 = document.createElement("hr")
  const hr2 = document.createElement("hr")

  
  const card_itens = document.createElement("div")
  card_itens.classList.add("pedido_itens")

  const ul1 = document.createElement("ul")

  pedido.itens.forEach((item) => {
    const li1 = document.createElement("li")
    li1.innerText = item.produto

    const ul2 = document.createElement("ul")
    ul2.classList.add("lista_complemento")

    if(item.complementos != null) {
      item.complementos.forEach((complemento) => {
        const li2 = document.createElement("li");
        li2.innerText = complemento.nome;
  
        ul2.append(li2)
      })
    }

    ul1.append(li1, ul2)
  })

  card_itens.append(ul1);

  const preco = document.createElement("p")
  preco.innerText = `TOTAL: R$${pedido.preco_total.toFixed(2).replace(".", ",")}`

  const button = document.createElement("button")
  button.classList.add("primary-button")
  button.dataset.pedidoId = pedido.id_pedido
  button.innerText = "Concluido"


  card.append(card_infos, hr1, card_itens, hr2, preco, button)

  return card
}

document.querySelector(".pedidos").addEventListener("click", (e) => {
  const button = e.target.closest("button.primary-button")

  if(button) {
    pedidos = pedidos.filter((c) => c.id_pedido != button.dataset.pedidoId)
    mostrarAviso(1)
    renderizarPedidos()
  }
})