const form = document.querySelector(".contenido-form");
const agregarPrestamo = document.querySelector(".menu-form");
const cerrar = document.querySelector(".cerrar");

agregarPrestamo.addEventListener("click", () => {
  if (agregarPrestamo.getAttribute("abierto") == "no") {
    form.style.display = "flex";
    cerrar.style.display = "flex";
    agregarPrestamo.setAttribute("abierto", "si");
    return;
  }
  if (agregarPrestamo.getAttribute("abierto") == "si") {
    form.style.display = "none";
    cerrar.style.display = "none";
    agregarPrestamo.setAttribute("abierto", "no");
    return;
  }
});
