import {db} from './prestamos.js';

const abrirModalDisponibles = document.querySelector(".abrir-disponibles");
const cerrarModalDisponibles = document.querySelector(
  ".cerrar-modal_disponibles"
);
const modalDisponibles = document.querySelector(".modal_disponibles");

abrirModalDisponibles.addEventListener("click", () => {
  modalDisponibles.classList.add("modal_disponibles--show");
});
cerrarModalDisponibles.addEventListener("click", () => {
  modalDisponibles.classList.remove("modal_disponibles--show");
});

const mostrarDispositivosDisponibles = async () => {
  try {
    const dispositivosSnapshot = await db
      .collection("dispositivos")
      .doc("srigtEXGBqFORYznUalA")
      .get();
    const stock = dispositivosSnapshot.data();

    // Obtener la cantidad prestada y total de cada tipo de dispositivo
    const cantidadNotebooksPrestadas = stock.cantidadNotebooks[1];
    const cantidadNotebooksTotal = stock.cantidadNotebooks[0];
    const cantidadAntenasPrestadas = stock.cantidadAntenas[1];
    const cantidadAntenasTotal = stock.cantidadAntenas[0];
    const cantidadMousesPrestadas = stock.cantidadMouses[1];
    const cantidadMousesTotal = stock.cantidadMouses[0];
    const cantidadTecladosPrestadas = stock.cantidadTeclados[1];
    const cantidadTecladosTotal = stock.cantidadTeclados[0];
    const cantidadTelesPrestadas = stock.cantidadTeles[1];
    const cantidadTelesTotal = stock.cantidadTeles[0];

    // Mostrar la información en el HTML
    document.querySelector(".ver_disponibles").innerHTML = `Notebooks : ${cantidadNotebooksPrestadas}/${cantidadNotebooksTotal} +`;
    document.querySelector(".antenas_disponibles").innerHTML = `Antenas : ${cantidadAntenasPrestadas}/${cantidadAntenasTotal}`;
    document.querySelector(".mouses_disponibles").innerHTML = `Mouses : ${cantidadMousesPrestadas}/${cantidadMousesTotal}`;
    document.querySelector(".teclados_disponibles").innerHTML = `Teclados : ${cantidadTecladosPrestadas}/${cantidadTecladosTotal}`;
    document.querySelector(".teles_disponibles").innerHTML = `Teles : ${cantidadTelesPrestadas}/${cantidadTelesTotal}`;

    // Aplicar la clase "dispositivo-prestado" a las notebooks que están en el array notebooksIDs
    const notebooksIDs = stock.notebooksIDs || [];
    const notebooksDisponibles = document.querySelectorAll(".notebooks_disponibles div");
    notebooksDisponibles.forEach((notebookDiv, index) => {
      const numero = index + 1;
      if (notebooksIDs.includes(numero)) {
        notebookDiv.classList.add("dispositivo-prestado");
      }
    });
  } catch (error) {
    console.error("Error al obtener la información de dispositivos disponibles:", error);
  }
};

// Llamar a la función para mostrar los dispositivos disponibles al cargar la página
mostrarDispositivosDisponibles();