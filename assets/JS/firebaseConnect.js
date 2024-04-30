import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcMr1nEHkyqZTLu6zq0iXhbzUDhDgF_YE",
  authDomain: "prestamodenotebooks.firebaseapp.com",
  projectId: "prestamodenotebooks",
  storageBucket: "prestamodenotebooks.appspot.com",
  messagingSenderId: "426037856037",
  appId: "1:426037856037:web:f51dd02badbfd354e47ccc",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export class ManageAccount {
  register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "../../index.html";
        // Mostrar alerta de registro exitoso
        alert(
          "Registro exitoso. Serás redirigido a la página de inicio de sesión."
        );
      })
      .catch((error) => {
        console.error(error.message);
        // Mostrar alerta de error de registro
        alert("Error al registrar: " + error.message);
      });
  }

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        // Mostrar alerta de inicio de sesión exitoso
        alert(
          "Has iniciado sesión correctamente. Serás redirigido a la página principal."
        );
        localStorage.setItem("HayUser?", "Si");
        window.location.href = "../../index.html";
      })
      .catch((error) => {
        console.error(error.message);
        // Mostrar alerta de error de inicio de sesión
        alert("Error al iniciar sesión: " + error.message);
      });
  }

  signOut() {
    signOut(auth)
      .then((_) => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
