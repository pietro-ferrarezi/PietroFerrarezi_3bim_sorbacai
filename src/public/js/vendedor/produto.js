const bttBuscar = document.querySelector("#btt-buscar")
const bttInserir = document.querySelector("#btt-inserir")
const bttAtualizar = document.querySelector("#btt-atualizar")
const bttExcluir = document.querySelector("#btt-excluir")
const bttConfirmar = document.querySelector("#btt-confirmar")
const bttCancelar = document.querySelector("#btt-cancelar")
const logElemento = document.querySelector("#log")

let produtos
let estado = "buscando"
let produto = undefined

window.onload = async () => {
    try {
        produtos = await buscarDadosProdutos()
    } catch (erro) {
        mostrarErro("Não foi possível carregar a lista de produtos. Recarregue a página.")
        produtos = []
    }
    limparAtributos()
}

// ---------------------------------------------------------
// Helpers de feedback e requisição
// ---------------------------------------------------------

function mostrarErro(mensagem) {
    exibirLog(mensagem, "erro")
}

function mostrarSucesso(mensagem) {
    exibirLog(mensagem, "sucesso")
}

function mostrarInfo(mensagem) {
    exibirLog(mensagem, "info")
}

function exibirLog(mensagem, tipo) {
    logElemento.textContent = mensagem
    logElemento.className = `formulario__log formulario__log--${tipo}`
}

function limparLog() {
    logElemento.textContent = ""
    logElemento.className = "formulario__log"
}

// Centraliza fetch + checagem de status + parse do JSON.
// fetch() só rejeita em erro de REDE; uma resposta 400/500 do servidor
// chega aqui normalmente, então é preciso checar `response.ok` manualmente.
async function requisicao(url, opcoes) {
    const resposta = await fetch(url, opcoes)
    const corpo = await resposta.json().catch(() => null)

    if (!resposta.ok) {
        const mensagem = corpo?.erro || `Erro ${resposta.status} ao processar a requisição`
        throw new Error(mensagem)
    }

    return corpo
}

// ---------------------------------------------------------
// Validação
// ---------------------------------------------------------

function validarCamposProduto() {
    const nome = document.querySelector("#inp-nome").value.trim()
    const tamanho = document.querySelector("#inp-tamanho").value.trim()
    const descricao = document.querySelector("#inp-descricao").value.trim()
    const preco = document.querySelector("#inp-preco").value

    const erros = []

    if (!nome) erros.push("Nome é obrigatório")
    if (!tamanho) erros.push("Tamanho é obrigatório")
    if (!descricao) erros.push("Descrição é obrigatória")
    if (preco === "" || isNaN(Number(preco)) || Number(preco) <= 0) {
        erros.push("Preço deve ser um número maior que zero")
    }

    return erros
}

function validarId(idTexto) {
    if (idTexto.trim() === "") return "Informe um ID"
    const id = Number(idTexto)
    if (isNaN(id) || id <= 0) return "ID deve ser um número válido maior que zero"
    return null
}

// ---------------------------------------------------------
// Busca
// ---------------------------------------------------------

function buscar() {
    limparAtributos()
    limparLog()
    const idTexto = document.querySelector("#inp-id").value

    const erroId = validarId(idTexto)
    if (erroId) {
        mostrarErro(erroId)
        visibilidadeBotoes(false, false, false)
        return
    }

    const id = Number(idTexto)
    produto = produtos.find(p => p.id_produto === id)

    if (!produto) {
        limparAtributos()
        document.querySelector("#inp-id").value = idTexto
        visibilidadeBotoes(true, false, false)
        mostrarInfo("Nenhum produto encontrado com esse ID. Você pode cadastrar um novo.")
        return
    }

    visibilidadeBotoes(false, true, false)
    preencherAtributos(produto)
    mostrarSucesso("Produto encontrado. Você pode atualizar ou excluir.")
}

// ---------------------------------------------------------
// Transições de estado
// ---------------------------------------------------------

function acaoAtualizar() {
    if (!produto) return
    estado = "atualizando"
    visibilidadeBotoes(false, false, true)
    habilitarAlteracao(true)
}

function acaoExcluir() {
    if (!produto) return
    estado = "excluindo"
    visibilidadeBotoes(false, false, true)
    habilitarAlteracao(false)
}

function acaoInserir() {
    estado = "inserindo"
    visibilidadeBotoes(false, false, true)
    habilitarAlteracao(true)
}

function cancelar() {
    limparAtributos()
    limparLog()
    habilitarAlteracao(false)
    visibilidadeBotoes(false, false, false)
}

async function salvar() {
    bttConfirmar.disabled = true
    bttCancelar.disabled = true

    try {
        switch (estado) {
            case "inserindo":
                await cadastrar()
                break;
            case "atualizando":
                await atualizar()
                break;
            case "excluindo":
                await excluir()
                break;
            default:
                break;
        }
    } finally {
        bttConfirmar.disabled = false
        bttCancelar.disabled = false
    }

    limparAtributos()
    habilitarAlteracao(false)
    visibilidadeBotoes(false, false, false)
}

document.querySelector("#inp-imagem").addEventListener("change", (event) => {
    const imagem = event.target.files[0]

    if (!imagem) return

    if (!imagem.type.startsWith("image/")) {
        mostrarErro("Selecione apenas arquivos de imagem")
        event.target.value = ""
        return
    }

    const leitor = new FileReader()

    leitor.onload = (e) => {
        document.querySelector("#imagemProduto").src = e.target.result
    }

    leitor.readAsDataURL(imagem);
})

function preencherAtributos(produto) {
    document.querySelector("#inp-nome").value = produto.nome
    document.querySelector("#inp-tamanho").value = produto.tamanho
    document.querySelector("#inp-descricao").value = produto.descricao
    document.querySelector("#inp-preco").value = produto.preco
    document.querySelector("#inp-complementos").checked = produto.pode_complementos

    preencherImagem(produto)
}

function preencherImagem(produto) {
    document.querySelector("#inp-imagem").value = "" // reseta a seleção de arquivo
    document.querySelector("#imagemProduto").src = `/images/produtos/${produto.id_produto}.png`
}

function limparAtributos() {
    document.querySelector("#inp-nome").value = ""
    document.querySelector("#inp-tamanho").value = ""
    document.querySelector("#inp-descricao").value = ""
    document.querySelector("#inp-preco").value = 0.00
    document.querySelector("#inp-complementos").checked = false
    document.querySelector("#inp-imagem").value = ""

    document.querySelector("#imagemProduto").src = "/images/silhueta_crud.jpeg"
}


function visibilidadeBotoes(inserir, alterar, confirmar) {
    bttInserir.style.display = inserir ? "block" : "none"
    bttAtualizar.style.display = alterar ? "block" : "none"
    bttExcluir.style.display = alterar ? "block" : "none"
    bttConfirmar.style.display = confirmar ? "block" : "none"
    bttCancelar.style.display = confirmar ? "block" : "none"
}

function habilitarAlteracao(habilitar) {
    document.querySelector("#atributos").disabled = !habilitar
    document.querySelector("#inp-id").readOnly = habilitar
    bttBuscar.disabled = habilitar
}

// ---------------------------------------------------------
// Operações (cadastrar / atualizar / excluir)
// ---------------------------------------------------------

async function cadastrar() {
    const idTexto = document.querySelector("#inp-id").value
    const erroId = validarId(idTexto)
    if (erroId) {
        mostrarErro(erroId)
        return
    }

    const errosCampos = validarCamposProduto()
    if (errosCampos.length > 0) {
        mostrarErro(errosCampos.join(", "))
        return
    }

    const id = Number(idTexto)
    const nome = document.querySelector("#inp-nome").value.trim()
    const tamanho = document.querySelector("#inp-tamanho").value.trim()
    const descricao = document.querySelector("#inp-descricao").value.trim()
    const preco = Number(document.querySelector("#inp-preco").value)
    const permite_complemento = document.querySelector("#inp-complementos").checked

    // já existe um produto com esse ID? evita duplicar sem depender só do backend
    if (produtos.some(p => p.id_produto === id)) {
        mostrarErro("Já existe um produto com esse ID")
        return
    }

    const corpoProduto = { id, nome, tamanho, descricao, preco, permite_complemento }

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/produto`, {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(corpoProduto)
        })

        // mantém a lista local em sincronia, sem precisar recarregar a página
        produtos.push({
            id_produto: id, nome, tamanho, descricao, preco,
            pode_complementos: permite_complemento
        })

        await salvar_imagem(id)
        mostrarSucesso("Produto cadastrado com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível cadastrar o produto: ${erro.message}`)
    }
}

async function atualizar() {
    const idTexto = document.querySelector("#inp-id").value
    const id = Number(idTexto) // já validado na busca, mas o campo é readonly aqui

    const errosCampos = validarCamposProduto()
    if (errosCampos.length > 0) {
        mostrarErro(errosCampos.join(", "))
        return
    }

    const nome = document.querySelector("#inp-nome").value.trim()
    const tamanho = document.querySelector("#inp-tamanho").value.trim()
    const descricao = document.querySelector("#inp-descricao").value.trim()
    const preco = Number(document.querySelector("#inp-preco").value)
    const permite_complemento = document.querySelector("#inp-complementos").checked

    const corpoProduto = { nome, tamanho, descricao, preco, permite_complemento }

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/produto/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(corpoProduto)
        })

        const index = produtos.findIndex(p => p.id_produto === id)
        if (index !== -1) {
            produtos[index] = {
                id_produto: id, nome, tamanho, descricao, preco,
                pode_complementos: permite_complemento
            }
        }

        await salvar_imagem(id)
        mostrarSucesso("Produto atualizado com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível atualizar o produto: ${erro.message}`)
    }
}

async function excluir() {
    const id = Number(document.querySelector("#inp-id").value)

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/produto/${id}`, { method: "DELETE" })

        produtos = produtos.filter(p => p.id_produto !== id)
        mostrarSucesso("Produto excluído com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível excluir o produto: ${erro.message}`)
    }
}

async function salvar_imagem(id) {
    const inputFiles = document.querySelector("#inp-imagem").files

    if (inputFiles.length === 0) return

    const formData = new FormData()
    formData.append('imagem', inputFiles[0])

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/imagem/${id}`, {
            method: 'POST',
            body: formData
        })
    } catch (erro) {
        // o produto já foi salvo nesse ponto, então avisa separado
        mostrarErro(`Produto salvo, mas houve um erro ao enviar a imagem: ${erro.message}`)
    }
}