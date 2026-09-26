const {query} = require("../db");

exports.cadastrarProduto = async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        // query("INSERT INTO produtos(nome, descricao) VALUES($1, $2)", [nome, descricao]);
        console.log("Requisitado!")
        res.status(200).json("Sucesso! Cadastrado!")
    } catch (err) {
        res.status(400).json(err)
    }
}

