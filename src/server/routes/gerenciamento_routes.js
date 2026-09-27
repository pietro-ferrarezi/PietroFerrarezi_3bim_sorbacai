const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views/vendedor/index_gerenciar.html"));
});

router.get("/produto", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views/vendedor/produto_gerenciar.html"))
})

router.get("/complemento", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views/vendedor/complemento_gerenciar.html"))
})

router.use("/api", require("./produtos_routes"))
router.use("/api", require("./complementos_routes"))

module.exports = router