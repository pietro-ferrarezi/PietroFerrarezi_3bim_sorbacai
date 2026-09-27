# 🍇 Sorbaçaí - Sistema de vendas

Sistema web simulado de uma açaiteria, desenvolvido como projeto escolar. Permite que clientes visualizem o cardápio e simulem pedidos, enquanto vendedores podem acompanhar os pedidos realizados e adicionar novo produtos.

> Último adicionado: sistema de gerenciamento -> adicione, exclua ou modifique produtos e complementos

---

## ✨ Funcionalidades

- 🛍️ **Área do cliente:** visualize os produtos disponíveis e adicione itens ao carrinho
- 📋 **Área do vendedor:** acompanhe os pedidos feitos pelos clientes
-    ╰┈➤  gerencie os produtos e complementos
- 🧾 Simulação do fluxo de pedido de uma açaiteria

---

## 🛠️ Tecnologias utilizadas

- **HTML5 & CSS3** — estrutura e estilização das páginas
- **Node.js** — ambiente de execução JavaScript no servidor
- **Express** — framework para criação das rotas e servidor web

---

## 🚀 Como instalar e rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na máquina

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/pietro-ferrarezi/PietroFerrarezi_3bim_sorbacai.git

# 2. Acesse a pasta do projeto
cd PietroFerrarezi_3bim_sorbacai

# 3. Instale as dependências
npm install

# 4. Utilizando o PgAdmin ou qualquer outro cliente do PostgreSQL, execute os arquivos create_tables.sql e insert_values.sql

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Abra o arquivo .env e preencha as variáveis necessárias

# 4. Inicie o servidor
npm run dev
```

5. Abra o navegador e acesse: `http://localhost:3040`

---

## 📁 Estrutura do projeto

```
src/
├── public/          # Arquivos estáticos (HTML, CSS, imagens)
├── server/          # Aplicação do servidor
└── views/           # Arquivos das páginas
database_infos/
├── create_tables.sql          # Arquivo para criação das tabelas
└── insert_values.sql          # Arquivo para população das tabelas
package.json
```

---

## 📝 Observações
- O carrinho e os pedidos são simulados, sem persistência real de dados

---

*Projeto desenvolvido para fins acadêmicos.*
