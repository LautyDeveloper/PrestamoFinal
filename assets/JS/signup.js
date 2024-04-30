import { ManageAccount } from "./firebaseConnect.js";
const clave = "Tec5";
document
  .getElementById("formulario-crear")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const claveInput = document.getElementById("key").value;

    if (claveInput !== "") {
      if (claveInput === clave) {
        const account = new ManageAccount();
        account.register(email, password);
      } else {
        alert("La clave no es correcta");
      }
    } else {
      alert("Antes de Registrarse debe ingresar la clave de usuario");
    }
  });

console.log("Formulario de Registro");
