const abrirNotebooksBtn = document.querySelector(".button");
const notebooks = document.querySelector(".notebooks");
const cartaDispositivos = document.querySelector(".dispositivos");
const vNotebooks = document.querySelector(".abrir-notebooks");

abrirNotebooksBtn.addEventListener("click", () => {
  if (notebooks.getAttribute("abierto") == "false") {
    notebooks.style.display = "flex";
    cartaDispositivos.style.height = "90%";
    notebooks.setAttribute("abierto", "true");
    vNotebooks.style.transform = "rotate(180deg)";
    return;
  }

  if (notebooks.getAttribute("abierto") == "true") {
    notebooks.style.display = "none";
    cartaDispositivos.style.height = "55%";
    notebooks.setAttribute("abierto", "false");
    vNotebooks.style.transform = "rotate(0deg)";
    return;
  }
});
