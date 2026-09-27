const bttBuscar = document.querySelector("#btt-buscar")
const bttInserir = document.querySelector("#btt-inserir")
const bttAtualizar = document.querySelector("#btt-atualizar")
const bttExcluir = document.querySelector("#btt-excluir")
const bttConfirmar = document.querySelector("#btt-confirmar")
const bttCancelar = document.querySelector("#btt-cancelar")
const logElemento = document.querySelector("#log")

let complementos
let estado = "buscando"
let complemento = undefined

window.onload = async () => {
    try {
        complementos = await buscarDadosComplementos()
    } catch (erro) {
        mostrarErro("Não foi possível carregar a lista de complementos. Recarregue a página.")
        complementos = []
    }
    limparAtributos()
}

// ---------------------------------------------------------
// Helpers de feedback e requisição
// (se esse arquivo estiver numa página separada da de produtos,
// duplique também mostrarErro/mostrarSucesso/requisicao aqui,
// ou extraia os três pra um arquivo comum tipo "utils.js" e importe nas duas páginas)
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

function validarCamposComplemento() {
    const nome = document.querySelector("#inp-nome").value.trim()
    const preco = document.querySelector("#inp-preco").value

    const erros = []

    if (!nome) erros.push("Nome é obrigatório")
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
    complemento = complementos.find(c => c.id_complemento === id)

    if (!complemento) {
        limparAtributos()
        document.querySelector("#inp-id").value = idTexto
        visibilidadeBotoes(true, false, false)
        mostrarInfo("Nenhum complemento encontrado com esse ID. Você pode cadastrar um novo.")
        return
    }

    visibilidadeBotoes(false, true, false)
    preencherAtributos(complemento)
    mostrarSucesso("Complemento encontrado. Você pode atualizar ou excluir.")
}

// ---------------------------------------------------------
// Transições de estado
// ---------------------------------------------------------

function acaoAtualizar() {
    if (!complemento) return
    estado = "atualizando"
    visibilidadeBotoes(false, false, true)
    habilitarAlteracao(true)
}

function acaoExcluir() {
    if (!complemento) return
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

function preencherAtributos(complemento) {
    document.querySelector("#inp-nome").value = complemento.nome
    document.querySelector("#inp-preco").value = complemento.preco
}

function limparAtributos() {
    document.querySelector("#inp-nome").value = ""
    document.querySelector("#inp-preco").value = 0.00
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

    const errosCampos = validarCamposComplemento()
    if (errosCampos.length > 0) {
        mostrarErro(errosCampos.join(", "))
        return
    }

    const id = Number(idTexto)
    const nome = document.querySelector("#inp-nome").value.trim()
    const preco = Number(document.querySelector("#inp-preco").value)

    if (complementos.some(c => c.id_complemento === id)) {
        mostrarErro("Já existe um complemento com esse ID")
        return
    }

    const corpoComplemento = { id, nome, preco }

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/complemento`, {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(corpoComplemento)
        })

        complementos.push({ id_complemento: id, nome, preco })
        mostrarSucesso("Complemento cadastrado com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível cadastrar o complemento: ${erro.message}`)
    }
}

async function atualizar() {
    const idTexto = document.querySelector("#inp-id").value
    const id = Number(idTexto) // já validado na busca; o campo fica readonly aqui

    const errosCampos = validarCamposComplemento()
    if (errosCampos.length > 0) {
        mostrarErro(errosCampos.join(", "))
        return
    }

    const nome = document.querySelector("#inp-nome").value.trim()
    const preco = Number(document.querySelector("#inp-preco").value)

    const corpoComplemento = { nome, preco }

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/complemento/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(corpoComplemento)
        })

        const index = complementos.findIndex(c => c.id_complemento === id)
        if (index !== -1) {
            complementos[index] = { id_complemento: id, nome, preco }
        }

        mostrarSucesso("Complemento atualizado com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível atualizar o complemento: ${erro.message}`)
    }
}

async function excluir() {
    const id = Number(document.querySelector("#inp-id").value)

    try {
        await requisicao(`${API_BASE_URL}/gerenciar/api/complemento/${id}`, { method: "DELETE" })

        complementos = complementos.filter(c => c.id_complemento !== id)
        mostrarSucesso("Complemento excluído com sucesso!")
    } catch (erro) {
        mostrarErro(`Não foi possível excluir o complemento: ${erro.message}`)
    }
}