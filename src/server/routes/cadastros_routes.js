const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/cadastros_controller");

router.post("/cadastrar_prod", async (req, res) => {
    console.log("Requisitado! Router")
    await produtoController.cadastrarProduto(req, res);
});

router.post("/cadastrar_comp", async (req, res) => {
    await produtoController.cadastrarComplemento(req, res);
});

module.exports = router;
