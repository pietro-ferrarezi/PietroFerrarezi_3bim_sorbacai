# Documentação de regras para implementação de estilização

## Nomenclatura de Classes
### Padrão BEM:
- **B**loco:
.classe 
- **E**lemento:
.classe__elemento
- **M**odificador:
.classe--modificador

Ex.:
```html
<header class="cabecalho">
  <img class="cabecalho__logo" ...>
  <h1 class="cabecalho__titulo">Sorbaçaí</h1>
</header>

<button class="botao botao--primario">Adicionar</button>
```

> Usar sempre **português** para nomes das classes.

## Cabeçalho

### Estrutura base:
```html
<header class="cabecalho">
  <section class="cabecalho__marca">
    <img class="cabecalho__logo" src="/images/icon.png" alt="" />
    <h1 class="cabecalho__titulo">Sorbaçaí</h1>
  </section>
  <nav class="cabecalho__nav">
    <p class="cabecalho__subtitulo">Página</p>
    <a href="*" class="cabecalho__botao" aria-label="botao">
      <i class="fa-solid fa-icone"></i>
    </a>
  </nav>
</header>
```

## Botões
### Botão Primário
Usado para ações gerais, confirmação e etc.
<br>`.botao--primario`

### Botão Secundário
Usado para ações de cancelamento ou opções secundárias.
<br>`.botao--secundario`

### Botão Especial
Usado para maior destaque.
<br>`.botao--especial`

> `.botao`: classe geral para estilização padrão de todos os botões

## Avisos
As mensagens e tipo de aviso devem ser controlados dinamicamente pelo JS.
Os avisos possuem a classe `.aviso` que define propriadades estilisticas padrões.
### Estrutura base:
```html
<div role="alert" aria-live="assertive" class="aviso">
  <p><span id="mensagemAviso"></span></p>
</div>
```

> Utilize a classe `.aviso--erro` (juntamente com `.aviso`) para avisos de erro.

## Formulários
```html
   <form class="formulario">
     <div class="formulario__busca">
       <div class="formulario__campo formulario__campo--compacto"> ID </div>
       <div class="formulario__acoes-topo"> botões buscar/inserir/... </div>
     </div>
 
     <fieldset class="formulario__campos" disabled>
       <legend class="formulario__legenda">
       <div class="formulario__grade">
         <div class="formulario__campo"> label + input </div>
         ...
       </div>
       <label class="formulario__imagem"> ... </label>
     </fieldset>
 
     <div class="formulario__acoes"> botões confirmar/cancelar </div>
   </form>

```