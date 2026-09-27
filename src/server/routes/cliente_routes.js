const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views/cliente/index_cliente.html"));
});

router.get("/carrinho", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views/cliente/carrinho.html"));
});

module.exports = router