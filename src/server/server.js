const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cors = require("cors");

const pool = require("./db");

const PORT = process.env.PORT || 3040;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/portaria.html"));
});

app.get("/redirect", (req, res) => {
  const tipo = req.query.tipo;

  if (tipo === "cliente") {
    return res.redirect("/cliente");
  }

  if (tipo === "vendedor") {
    return res.redirect("/vendedor");
  }

  res.redirect("/");
});

app.get("/cliente", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/cliente/index_cliente.html"));
});

app.get("/vendedor", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/admin/index_vendedor.html"));
});

app.get("/vendedor/registrar_produto", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/admin/registrar_produto.html"));
});

app.get("/cliente/carrinho", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/cliente/carrinho.html"));
});

app.get("/infos/produtos", async (req, res) => {
  const result = await pool.query("SELECT * FROM public.produtos;");
  const dados = await result.rows;

  res.send({ status: "ok", dados: dados }).status(200);
});

app.get("/infos/complementos", async (req, res) => {
  const result = await pool.query("SELECT * FROM public.complementos;");
  const dados = await result.rows;

  res.send({ status: "ok", dados: dados }).status(200);
});

app.get("/infos/pedidos", async (req, res) => {
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

    res.send({ status: "ok", pedidos: pedidos }).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running! http://localhost:${PORT}`);
});
