const express = require("express")
const router = express.Router()

const complementosController = require("../controllers/complementos_controller")

router.post("/complemento", (req, res) => {
    complementosController.cadastrar_complemento(req, res)
})

router.put("/complemento/:id", (req, res) => {
    complementosController.atualizar_complemento(req, res)
})

router.delete("/complemento/:id", (req, res) => {
    complementosController.deletar_complemento(req, res)
})

module.exports = router