const API_BASE_URL = "http://localhost:3040";

function mostrarAviso(text, erro = false) {

  let {aviso, mensagemSpan} = gerarAviso()
  mensagemSpan.textContent = text

  if (erro) {
    aviso.classList.add("aviso--erro");
  }

  aviso.style.display = "block";
  setTimeout(() => aviso.style.display = "none", 2000)
}

function gerarAviso() {
  const div = document.createElement("div");
  div.role = "alert";
  div.ariaLive = "assertive";
  div.classList.add("aviso")  
  div.style.display = "none"

  const p = document.createElement("p")

  const span = document.createElement("span")

  p.appendChild(span)
  div.appendChild(p)

  document.querySelector("main").appendChild(div)

  return {aviso: div, mensagemSpan: span}
}

async function buscarInformacoesDaAPI() {
  let produtos = await buscarDadosProdutos()
  let complementos = await buscarDadosComplementos()

  return [produtos, complementos]
}

async function buscarDadosProdutos() {
  const fetchProdutos = await fetch(`${API_BASE_URL}/infos/produtos`);
  const produtos = await fetchProdutos.json();
  return produtos.dados
}

async function buscarDadosComplementos() {
  const fetchComplementos = await fetch(`${API_BASE_URL}/infos/complementos`);
  const complementos = await fetchComplementos.json();
  return complementos.dados
}