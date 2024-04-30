const abrirModal = document.querySelector(".dispositivos-button");
const cerrarModal = document.querySelector(".cerrar-modal");
const modal = document.querySelector(".modal");

abrirModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("modal--show");
});

cerrarModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.remove("modal--show");
});
