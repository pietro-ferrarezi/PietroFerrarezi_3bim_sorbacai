const { pool } = require("../db");
const sharp = require("sharp");
const path = require("path");

exports.cadastrar_produto = async (req, res) => {
    try {
        const { id, nome, tamanho, descricao, preco, permite_complemento } =
            req.body;

        if (
            !id ||
            !nome ||
            !tamanho ||
            !descricao ||
            !preco ||
            permite_complemento === undefined
        ) {
            return res
                .status(400)
                .json({ status: "error", erro: "Valores faltantes na requisição" });
        }

        await pool.query(
            "INSERT INTO public.produtos (id_produto, nome, tamanho, descricao, preco, pode_complementos) VALUES ($1, $2, $3, $4, $5, $6);",
            [id, nome, tamanho, descricao, preco, permite_complemento],
        );

        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", erro: err.message });
    }
};

exports.atualizar_produto = async (req, res) => {
    try {
        const { nome, tamanho, descricao, preco, permite_complemento } = req.body;
        const id = req.params.id;

        if (
            !id ||
            !nome ||
            !tamanho ||
            !descricao ||
            !preco ||
            permite_complemento === undefined
        ) {
            return res
                .status(400)
                .json({ status: "error", erro: "Valores faltantes na requisição" });
        }

        await pool.query(
            "UPDATE public.produtos SET nome = $2, tamanho = $3, descricao = $4, preco = $5, pode_complementos = $6 WHERE id_produto = $1;",
            [id, nome, tamanho, descricao, preco, permite_complemento],
        );

        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", erro: err.message });
    }
};

exports.deletar_produto = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ status: "erro", erro: "ID do produto não informado." });
        }

        await pool.query("DELETE FROM public.produtos WHERE id_produto = $1;", [id]);
        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "erro", erro: err.message });
    }
};

exports.salvar_imagem = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ status: "error", erro: "Nenhuma imagem enviada" });
        }

        const originalFile = req.file.buffer;
        const idProduto = req.params.id;
        const destino = path.join(
            __dirname,
            "../..",
            "public/images/produtos",
            `${idProduto}.png`,
        );

        await sharp(originalFile).png().toFile(destino);

        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", erro: err.message });
    }
};
