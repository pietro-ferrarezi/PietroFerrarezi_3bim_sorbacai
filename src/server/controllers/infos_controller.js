const {pool} = require("../db")

const infosProdutos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM public.produtos;");
        const dados = result.rows
    
        res.json({ status: "ok", dados: dados }).status(200);
    } catch (err) {
        res.json({ status: "error", erro: err }).status(500);
    }
}

const infosComplementos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM public.complementos;", []);
        const dados = await result.rows;

        res.json({ status: "ok", dados: dados }).status(200);
    } catch (err) {
        res.json({ status: "error", erro: err }).status(500);
    }
}

const infosPedidos = async (req, res) => {
    try {
        const query = `
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
            'id_pedido', p.id_pedido,
            'nome', p.nome_cliente,
            'data', TO_CHAR(p.data, 'DD/MM/YY - HH24:MI'),
            'preco_total', p.preco_total,
            'itens', (
                SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id_item', ip.id_item,
                    'produto', pr.nome,
                    'tamanho', pr.tamanho,
                    'quantidade', ip.quantidade,
                    'preco_unitario', pr.preco,
                    'complementos', (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                        'id_complemento', c.id_complemento,
                        'nome', c.nome,
                        'preco', c.preco
                        )
                    )
                    FROM itens_pedido_complemento ipc
                    JOIN complementos c ON c.id_complemento = ipc.id_complemento
                    WHERE ipc.id_item = ip.id_item
                    )
                )
                )
                FROM itens_pedido ip
                JOIN produtos pr ON pr.id_produto = ip.id_produto
                WHERE ip.id_pedido = p.id_pedido
            )
            ) ORDER BY p.data ASC
        ) AS pedidos
        FROM pedidos p;
        `;

        const result = await pool.query(query);
        const pedidos = result.rows[0].pedidos;

        res.json({ status: "ok", dados: pedidos }).status(200);
    } catch (err) {
        res.json({ status: "error", erro: err }).status(500);
    }
}

module.exports = {
    infosProdutos,
    infosComplementos,
    infosPedidos
}