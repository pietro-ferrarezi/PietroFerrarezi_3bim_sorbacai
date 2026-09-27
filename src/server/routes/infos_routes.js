const express = require("express")
const router = express.Router()
const path = require("path")

const infosController = require("../controllers/infos_controller")

router.get("/produtos", async (req, res) => {
    infosController.infosProdutos(req, res)
});

router.get("/complementos", async (req, res) => {
    infosController.infosComplementos(req, res)
});

router.get("/pedidos", async (req, res) => {
    infosController.infosPedidos(req, res)
});

module.exports = router