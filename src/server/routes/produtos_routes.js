const express = require("express")
const router = express.Router()
const upload = require("../config/multerConfig")

const produtoController = require("../controllers/produtos_controller.js")

router.post("/produto", (req, res) => {
    produtoController.cadastrar_produto(req, res)
})

router.put("/produto/:id", (req, res) => {
    produtoController.atualizar_produto(req, res)
})

router.delete("/produto/:id", (req, res) => {
    produtoController.deletar_produto(req, res)
})

router.post("/imagem/:id", upload.single("imagem"), (req, res) => {
    produtoController.salvar_imagem(req, res)
})

module.exports = router