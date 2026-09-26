const enviar = async () => {
    try {
        const dadosProduto = { nome: "mascara", descricao: "mascara labial com" };
    
        const resposta = await fetch("http://localhost:3040/cadastrar/cadastrar_prod", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ dadosProduto }),
        });
    
        const dados = await resposta.json();
    
        console.log(dados);
    } catch (err) {
        console.error(err);
    }
}

window.onload = async () => {
    await enviar();
};
