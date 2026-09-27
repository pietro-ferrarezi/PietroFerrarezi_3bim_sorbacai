const { pool } = require("../db");

exports.cadastrar_complemento = async (req, res) => {
    try {
        const { id, nome, preco } = req.body;

        if (!id || !nome || !preco) {
            return res
                .status(400)
                .json({ status: "error", erro: "Valores faltantes na requisição" });
        }

        await pool.query(
            "INSERT INTO public.complementos (id_complemento, nome, preco) VALUES ($1, $2, $3);",
            [id, nome, preco],
        );

        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", erro: err.message });
    }
};
exports.atualizar_complemento = async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const id = req.params.id;

        if (!id || !nome || !preco) {
            return res
                .status(400)
                .json({ status: "error", erro: "Valores faltantes na requisição" });
        }

        await pool.query(
            "UPDATE public.complementos SET nome = $2, preco = $3 WHERE id_complemento = $1;",
            [id, nome, preco],
        );

        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json({ status: "error", erro: err.message });
    }
};
exports.deletar_complemento = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res
                .status(400)
                .json({ status: "erro", erro: "ID do complemento não informado." });
        }

        await pool.query(
            "DELETE FROM public.complementos WHERE id_complemento = $1;",
            [id]
        );
        res.status(200).json({ status: "sucesso" });
    } catch (err) {
        return res.status(500).json({ status: "erro", erro: err.message });
    }
};
