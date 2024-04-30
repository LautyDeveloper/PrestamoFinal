const contenedorVentana = document.querySelector(".ventana-editar");
const botonCerrar = document.querySelector(".editar-boton-cerrar");
const notebooksMas = document.querySelector(".notebooks-editar-mas");
const contenedorNotebooks = document.querySelector(
  ".notebooks-prestamo-editar"
);

botonCerrar.addEventListener("click", () => {
  contenedorVentana.style.display = "none";
});

notebooksMas.addEventListener("click", () => {
  if (contenedorNotebooks.getAttribute("estado") == "cerrado") {
    contenedorNotebooks.style.display = "flex";
    contenedorNotebooks.setAttribute("estado", "abierto");
    notebooksMas.textContent="x";
    return;
  }
  if (contenedorNotebooks.getAttribute("estado") == "abierto") {
    contenedorNotebooks.style.display = "none";
    contenedorNotebooks.setAttribute("estado", "cerrado");
    notebooksMas.textContent="v";
    return;
  }
});
