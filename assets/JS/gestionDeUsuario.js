const modalUser = document.querySelector(".modal_user");
const abrirModalUser = document.querySelector(".abrir_user");
const cerrarModalUser = document.querySelector(".cerrar-modal_user");
const usuario = document.querySelector(".usuario");
const cerrarSesion = document.querySelector(".cerrar_sesion");
const iniciarSesion = document.querySelector(".inciar_sesion");
const iniciarSesionIndex = document.querySelector(".iniciar-sesion");
const botonEditar = document.querySelector(".boton .verde");
const botonCompletado = document.querySelector(".boton .azul");
usuario.innerHTML = localStorage.getItem("User");
if (localStorage.getItem("HayUser?") == "Si") {
  cerrarSesion.style.display = "block";
  iniciarSesion.style.display = "none";
  iniciarSesionIndex.style.display = "flex";
  //botonEditar.style.display = "grid";
  //botonCompletado.style.display = "grid";
}
if (localStorage.getItem("HayUser?") == "No") {
  cerrarSesion.style.display = "none";
  iniciarSesionIndex.style.display = "none";
  iniciarSesion.style.display = "block";
  //botonEditar.style.display = "none";
  //botonCompletado.style.display = "none";
  usuario.innerHTML = "No hay Usuario registrado";
}

cerrarSesion.addEventListener("click", () => {
  localStorage.setItem("User", "");
  localStorage.setItem("HayUser?", "No");
  location.reload();
});
abrirModalUser.addEventListener("click", () => {
  modalUser.classList.add("modal_user--show");
});

cerrarModalUser.addEventListener("click", () => {
  modalUser.classList.remove("modal_user--show");
});
