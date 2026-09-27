const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "portaria.html"));
});

router.get("/redirect", (req, res) => {
  const tipo = req.query.tipo;

  if (tipo === "cliente") {
    return res.redirect("/cliente");
  }

  if (tipo === "vendedor") {
    return res.redirect("/vendedor");
  }

  if (tipo === "g_produto") {
    return res.redirect("/gerenciar/produto")
  }

  if (tipo === "g_complemento") {
    return res.redirect("/gerenciar/complemento")
  }

  res.redirect("/");
});

module.exports = router;