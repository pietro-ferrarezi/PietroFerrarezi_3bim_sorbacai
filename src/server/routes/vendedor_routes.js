const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views/vendedor/index_vendedor.html"));
});

router.get("/gerenciar", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views/vendedor/index_gerenciar.html"));
});

module.exports = router