function mostrarAviso(type) {
  let aviso
  if (type === 1) {
    aviso = document.querySelector("#sucesso");
  } else if (type === 2) {
    aviso = document.querySelector("#erro")
  }

  aviso.style.display = "block";
  setTimeout(() => aviso.style.display = "none", 2000)
}