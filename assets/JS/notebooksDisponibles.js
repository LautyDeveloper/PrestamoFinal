const cartaDisponibles = document.querySelector(".dispositivos_disponibles");
const verNotebooksDisponibles = document.querySelector(".ver_disponibles");
const notebooksDisponibles = document.querySelector(".notebooks_disponibles");

verNotebooksDisponibles.addEventListener("click", () => {
  if (notebooksDisponibles.getAttribute("abierto") == "no") {
    cartaDisponibles.style.height = "80%";
    notebooksDisponibles.style.display = "flex";
    verNotebooksDisponibles.innerHTML =
      verNotebooksDisponibles.innerHTML.replace("+", "-");
    notebooksDisponibles.setAttribute("abierto", "si");
    return;
  }
  if (notebooksDisponibles.getAttribute("abierto") == "si") {
    cartaDisponibles.style.height = "55%";
    notebooksDisponibles.style.display = "none";
    verNotebooksDisponibles.innerHTML =
      verNotebooksDisponibles.innerHTML.replace("-", "+");
    notebooksDisponibles.setAttribute("abierto", "no");
    return;
  }
});
