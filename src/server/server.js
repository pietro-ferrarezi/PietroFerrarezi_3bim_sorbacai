const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 3040;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public/")));

// Rotas

app.use("/", require("./routes/redirecionamentos_routes"));

app.use("/cliente", require("./routes/cliente_routes"));

app.use("/vendedor", require("./routes/vendedor_routes"));

app.use("/infos", require("./routes/infos_routes"));

app.use("/gerenciar", require("./routes/gerenciamento_routes"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running! http://localhost:${PORT}`);
});
