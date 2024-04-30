const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBtiovCGbcBl0x9Y9ANq8HLP_ETScYBsrA",
  authDomain: "prestamodenotebooks-3745b.firebaseapp.com",
  projectId: "prestamodenotebooks-3745b",
  storageBucket: "prestamodenotebooks-3745b.appspot.com",
  messagingSenderId: "869282035859",
  appId: "1:869282035859:web:d460cc08b22194220a3566",
});

export const db = firebaseApp.firestore();

const crearCheckbox = (numero, notebooksIDs) => {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("checkbox");
  input.name = `notebook-${numero}`;
  input.id = `notebook-${numero}`;
  const span = document.createElement("span");
  span.textContent = numero;

  // Verificar si el ID del checkbox está en notebooksIDs
  if (notebooksIDs && notebooksIDs.includes(numero)) {
    // Aplicar estilo rojo si el checkbox está en notebooksIDs
    //input.style.backgroundColor = "#FF0000"; // Rojo hexadecimal
    input.classList.remove("checkbox");
    label.classList.add("notebook-seleccionada");
  }

  label.appendChild(input);
  label.appendChild(span);
  return label;
};

let valores = [];

const generarCheckboxes = (cantidad, notebooksIDs) => {
  const notebooksDiv = document.querySelector(".notebooks .content");
  notebooksDiv.innerHTML = ""; // Limpiar contenido existente
  for (let i = 1; i <= cantidad; i++) {
    const checkbox = crearCheckbox(i, notebooksIDs);
    notebooksDiv.appendChild(checkbox);
  }

  // Agregar evento de escucha a cada checkbox después de generarlos
  const checkboxes = document.querySelectorAll(".checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // Si el checkbox está marcado y no está en notebooksIDs, agregar el valor del span al array
      if (
        this.checked &&
        !notebooksIDs.includes(parseInt(this.nextElementSibling.textContent))
      ) {
        const valor = parseInt(this.nextElementSibling.textContent);
        valores.push(valor);
      } else if (!this.checked) {
        // Si el checkbox está desmarcado, eliminar el valor del array
        const valor = parseInt(this.nextElementSibling.textContent);
        const index = valores.indexOf(valor);
        if (index !== -1) {
          valores.splice(index, 1);
        }
      }

      // Mostrar el array actualizado en la consola
      console.log("Valores acumulados:", valores);
    });
  });
};

const leerCantidadNotebooks = async () => {
  try {
    const dispositivosSnapshot = await db
      .collection("dispositivos")
      .doc("srigtEXGBqFORYznUalA")
      .get();
    const stock = dispositivosSnapshot.data();
    const cantidadNotebooks = stock.cantidadNotebooks[0];
    const notebooksIDs = stock.notebooksIDs || []; // Obtener notebooksIDs o asignar un array vacío si no existe
    generarCheckboxes(cantidadNotebooks, notebooksIDs);
  } catch (error) {
    console.error("Error al obtener la cantidad de notebooks:", error);
  }
};

leerCantidadNotebooks();

const btnConfirmar = document.querySelector(".btn-confirmar");

btnConfirmar.addEventListener("click", async (e) => {
  e.preventDefault();
  btnConfirmar.style.display = "none";

  // Obtener la cantidad de cada tipo de dispositivo seleccionado
  const inputs = {
    inputMouses: parseInt(document.querySelector(".input-mouses").value),
    inputAntenas: parseInt(document.querySelector(".input-antenas").value),
    inputTeles: parseInt(document.querySelector(".input-teles").value),
    inputTeclados: parseInt(document.querySelector(".input-teclados").value),
  };
  const inputCurso = document.querySelector(".input-curso").value;
  const inputProfe = document.querySelector(".input-profe").value;

  if ((inputCurso.length < 1) | (inputProfe.length < 1)) {
    const pModal = document.querySelector(".err_modal");
    pModal.textContent = "Profesor o curso invalidos";
    return;
  }


  // Iterar sobre las entradas y reemplazar NaN con 0
  for (let key in inputs) {
    if (isNaN(inputs[key]) | (inputs[key] < 0)) {
      inputs[key] = 0;
    }
  }

  // Verificar si hay suficientes dispositivos disponibles en stock
  const dispositivosSnapshot = await db
    .collection("dispositivos")
    .doc("srigtEXGBqFORYznUalA")
    .get();
  const stock = dispositivosSnapshot.data();
  const notesId = stock.notebooksIDs;

  if (
    stock.cantidadNotebooks[1] + valores.length > stock.cantidadNotebooks[0] ||
    stock.cantidadMouses[1] + inputs.inputMouses > stock.cantidadMouses[0] ||
    stock.cantidadAntenas[1] + inputs.inputAntenas > stock.cantidadAntenas[0] ||
    stock.cantidadTeles[1] + inputs.inputTeles > stock.cantidadTeles[0] ||
    stock.cantidadTeclados[1] + inputs.inputTeclados > stock.cantidadTeclados[0]
  ) {
    const pModal = document.querySelector(".err_modal");
    pModal.textContent =
      "No hay suficientes dispositivos disponibles en stock.";
    btnConfirmar.style.display = "block";
    return;
  }

  // Actualizar la cantidad prestada en la colección "dispositivos"
  await db
    .collection("dispositivos")
    .doc("srigtEXGBqFORYznUalA")
    .update({
      cantidadNotebooks: [
        stock.cantidadNotebooks[0],
        stock.cantidadNotebooks[1] + valores.length,
      ],
      notebooksIDs: notesId.concat(valores),
      cantidadMouses: [
        stock.cantidadMouses[0],
        stock.cantidadMouses[1] + inputs.inputMouses,
      ],
      cantidadAntenas: [
        stock.cantidadAntenas[0],
        stock.cantidadAntenas[1] + inputs.inputAntenas,
      ],
      cantidadTeles: [
        stock.cantidadTeles[0],
        stock.cantidadTeles[1] + inputs.inputTeles,
      ],
      cantidadTeclados: [
        stock.cantidadTeclados[0],
        stock.cantidadTeclados[1] + inputs.inputTeclados,
      ],
    });

  // Registrar el préstamo en la colección "prestamos"
  const now = new Date(); // Obtener la fecha y el horario actual del dispositivo
const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`; // Formatear la fecha
const formattedTime = `${now.getHours()}:${(now.getMinutes() < 10 ? '0' : '') + now.getMinutes()}`; // Formatear el horario
const formattedDateTime = ` ${formattedDate} - ${formattedTime}`; // Combinar fecha y horario

await db
  .collection("prestamos")
  .add({
    curso: inputCurso,
    profesor: inputProfe,
    notebooksCantidad: valores.length,
    idNotebooks: valores,
    mouses: inputs.inputMouses,
    antenas: inputs.inputAntenas,
    teclados: inputs.inputTeclados,
    teles: inputs.inputTeles,
    estado: "activo",
    fechaHorario: formattedDateTime // Agregar fecha y horario formateados
  })
  .then((docRef) => {
    console.log("document written with ID: ", docRef.id);
    window.location.href = "index.html";
  })
  .catch((err) => {
    console.log("error adding document: ", err);
  });

});

const crearCarta = (
  curso,
  profesor,
  notebooks,
  antenas,
  mouses,
  teclados,
  televisor,
  notebooksIds,
  prestamoId,
  fechaHora
) => {
  // Crear elementos HTML para la carta
  const carta = document.createElement("div");
  carta.classList.add("carta");
  carta.setAttribute("data-prestamo-id", prestamoId); // Añadir atributo de datos para identificar el préstamo

  const arriba = document.createElement("div");
  arriba.classList.add("arriba", "cursoprofe");

  const cursoProfesor = document.createElement("div");
  cursoProfesor.classList.add("curso-profesor");

  const h2 = document.createElement("h2");
  h2.textContent = curso;

  const p = document.createElement("p");
  p.textContent = "Prof: " + profesor;

  cursoProfesor.appendChild(h2);
  cursoProfesor.appendChild(p);

  const botones = document.createElement("div");
  botones.classList.add("botones");

  const botonVerde = document.createElement("div");
  botonVerde.classList.add("boton", "verde");
  botonVerde.innerHTML = `<img src="./assets/media/pencil.png" alt="edit button">`;

  const botonAzul = document.createElement("div");
  botonAzul.classList.add("boton", "azul");
  botonAzul.innerHTML = `<img src="./assets/media/complete.png" alt="complete button">`;

  botones.appendChild(botonVerde);
  botones.appendChild(botonAzul);
  arriba.appendChild(cursoProfesor);
  arriba.appendChild(botones);

  if (localStorage.getItem("HayUser?") == "No") {
    botones.style.display = "none";
  }

  const contenidoMenos = document.createElement("div");
  contenidoMenos.classList.add("contenido", "menos");

  const ulMenos = document.createElement("ul");
  ulMenos.innerHTML = `
      <li>Notebooks: ${notebooks}</li>
      <li>Antenas: ${antenas}</li>
      <li>Mouse's: ${mouses}</li>
      <li>Televisores: ${televisor}</li>
      <li>Teclado: ${teclados}</li>
    `;

  const botonDetalles = document.createElement("button");
  botonDetalles.classList.add("detalles-boton");
  botonDetalles.textContent = "Detalles";

  const botonContainer = document.createElement("div");
  botonContainer.classList.add("boton");

  botonContainer.appendChild(botonDetalles);

  contenidoMenos.appendChild(ulMenos);
  contenidoMenos.appendChild(botonContainer);

  const contenidoDetalles = document.createElement("div");
  contenidoDetalles.classList.add("contenido", "detalles");
  contenidoDetalles.innerHTML = `
      <ul>
        <li><span>Fecha/Hora:</span> ${fechaHora}</li>
        <li><span>Notebooks:</span> ${notebooksIds}</li>
        <li><span>Antenas:</span> ${antenas}</li>
        <li><span>Mouse's:</span> ${mouses}</li>
        <li><span>Televisores:</span> ${televisor}</li>
        <li><span>Teclado:</span> ${teclados}</li>
      </ul>
    `;

  const botonVerMenos = document.createElement("button");
  botonVerMenos.classList.add("mostrar-menos");
  botonVerMenos.textContent = "Mostrar Menos";

  const botonVerMenosContainer = document.createElement("div");
  botonVerMenosContainer.classList.add("boton");

  botonVerMenosContainer.appendChild(botonVerMenos);

  contenidoDetalles.appendChild(botonVerMenosContainer);

  // Agregar eventos para alternar entre contenido menos y detalles
  botonDetalles.addEventListener("click", () => {
    carta.style.height = "450px";
    contenidoMenos.style.display = "none";
    contenidoDetalles.style.display = "flex";
    arriba.style.height = "12%";
  });

  botonVerMenos.addEventListener("click", () => {
    carta.style.height = "200px";
    contenidoMenos.style.display = "flex";
    contenidoDetalles.style.display = "none";
    arriba.style.height = "27%";
  });

  const cartasContainer = document.querySelector(".cartas-container");
  carta.appendChild(arriba);
  carta.appendChild(contenidoMenos);
  carta.appendChild(contenidoDetalles);
  cartasContainer.appendChild(carta);

  botonVerde.addEventListener("click", async () => {
    const ventanaEditar = document.querySelector(".ventana-editar");
    ventanaEditar.style.display = "grid";

    //id del prestamo
    const prestamoId = carta.getAttribute("data-prestamo-id");

    // Obtener los datos del préstamo
    const prestamoSnapshot = await db
      .collection("prestamos")
      .doc(prestamoId)
      .get();
    const prestamoData = prestamoSnapshot.data();

    //id de las notebooks prestadas
    const notebooksSeleccionadas = prestamoData.idNotebooks;
    
    // Obtener los datos de los dispositivos prestados en el préstamo
    const dispositivosPrestados = {
      notebooks: prestamoData.notebooksCantidad,
      antenas: prestamoData.antenas,
      mouses: prestamoData.mouses,
      teclados: prestamoData.teclados,
      teles: prestamoData.teles,
    };
    
    const numsEditar = {
      antenas: document.querySelector(".num-antenas"),
      mouses: document.querySelector(".num-mouses"),
      teclados: document.querySelector(".num-teclados"),
      teles: document.querySelector(".num-teles"),
    };
    
    // Obtener los datos de los dispositivos en stock
    const dispositivosStockSnapshot = await db
    .collection("dispositivos")
    .doc("srigtEXGBqFORYznUalA")
    .get();
    const dispositivosStock = dispositivosStockSnapshot.data();
    const primerValorCantidadNotebooks = dispositivosStock.cantidadNotebooks[0];
    const segundoValorCantidadNotebooks = dispositivosStock.cantidadNotebooks[1];
    const notebooksPrestadas = dispositivosStock.notebooksIDs;
    
    // Seleccionar el contenedor de notebooks
    const notebooksContainer = document.querySelector(
      ".notebooks-prestamo-editar"
    );

    // Limpiar las IDs de las notebooks existentes
    notebooksContainer.innerHTML = "";

    // Crear dinámicamente las notebooks
    for (let i = 1; i <= primerValorCantidadNotebooks; i++) {
      const divNotebook = document.createElement("div");
      divNotebook.textContent = i.toString();
      divNotebook.className = "id-notebook-prestamo";

      // Verificar si la notebook está prestada
      if (notebooksSeleccionadas.includes(i)) {
        divNotebook.classList.add("id-notebook-seleccionada");
      } else if (notebooksPrestadas.includes(i)) {
        divNotebook.classList.add("id-notebook-prestada");
      }

      // Agregar evento de click a la notebook
      divNotebook.addEventListener("click", () => {
        const notebookId = i;

        // Verificar si la notebook está en notebooksIDs
        if (!notebooksPrestadas.includes(notebookId)) {
          // Si no está seleccionada, agregarla y actualizar la clase
          // Mostrar los cambios en la consola
          notebooksSeleccionadas.push(notebookId);
          notebooksPrestadas.push(notebookId);
          divNotebook.classList.add("id-notebook-seleccionada");
          console.log("idNotebooks:", notebooksSeleccionadas);
          console.log("prestadas:", notebooksPrestadas);
          return;
        } // Si la notebook no está en notebooksIDs, agregarla o quitarla de idNotebooks
        if (notebooksSeleccionadas.includes(notebookId)) {
          // Si ya está seleccionada, quitarla y actualizar la clase
          const index = notebooksSeleccionadas.indexOf(notebookId);
          const index2 = notebooksPrestadas.indexOf(notebookId);
          notebooksSeleccionadas.splice(index, 1);
          notebooksPrestadas.splice(index2, 1);

          divNotebook.classList.remove("id-notebook-seleccionada");
          divNotebook.classList.remove("id-notebook-prestada");
          console.log("idNotebooks:", notebooksSeleccionadas);
          console.log("prestadas:", notebooksPrestadas);
          return;
        }
      });

      notebooksContainer.appendChild(divNotebook);
    }

    numsEditar.antenas.textContent = dispositivosPrestados.antenas;
    numsEditar.mouses.textContent = dispositivosPrestados.mouses;
    numsEditar.teclados.textContent = dispositivosPrestados.teclados;
    numsEditar.teles.textContent = dispositivosPrestados.teles;

    const mousesMas = document.querySelector(".mouses-mas");

    mousesMas.addEventListener("click", () => {
      dispositivosPrestados.mouses++;
      numsEditar.mouses.textContent = dispositivosPrestados.mouses;
    });
    const mousesMenos = document.querySelector(".mouses-menos");

    mousesMenos.addEventListener("click", () => {
      dispositivosPrestados.mouses--;
      numsEditar.mouses.textContent = dispositivosPrestados.mouses;
    });

    const antenasMas = document.querySelector(".antenas-mas");

    antenasMas.addEventListener("click", () => {
      dispositivosPrestados.antenas++;
      numsEditar.antenas.textContent = dispositivosPrestados.antenas;
    });
    const antenasMenos = document.querySelector(".antenas-menos");

    antenasMenos.addEventListener("click", () => {
      dispositivosPrestados.antenas--;
      numsEditar.antenas.textContent = dispositivosPrestados.antenas;
    });

    const tecladosMas = document.querySelector(".teclados-mas");

    tecladosMas.addEventListener("click", () => {
      dispositivosPrestados.teclados++;
      numsEditar.teclados.textContent = dispositivosPrestados.teclados;
    });
    const tecladosMenos = document.querySelector(".teclados-menos");

    tecladosMenos.addEventListener("click", () => {
      dispositivosPrestados.teclados--;
      numsEditar.teclados.textContent = dispositivosPrestados.teclados;
    });

    const telesMas = document.querySelector(".teles-mas");

    telesMas.addEventListener("click", () => {
      dispositivosPrestados.teles++;
      numsEditar.teles.textContent = dispositivosPrestados.teles;
    });
    const telesMenos = document.querySelector(".teles-menos");

    telesMenos.addEventListener("click", () => {
      dispositivosPrestados.teles--;
      numsEditar.teles.textContent = dispositivosPrestados.teles;
    });

    const btnGuardar = document.querySelector(".btn-guardar-cambios");

    btnGuardar.addEventListener("click", async () => {
      if (
        dispositivosStock.cantidadMouses[1] -
          prestamoData.mouses +
          dispositivosPrestados.mouses <=
          dispositivosStock.cantidadMouses[0] &&
        dispositivosStock.cantidadAntenas[1] -
          prestamoData.antenas +
          dispositivosPrestados.antenas <=
          dispositivosStock.cantidadAntenas[0] &&
        dispositivosStock.cantidadTeclados[1] -
          prestamoData.teclados +
          dispositivosPrestados.teclados <=
          dispositivosStock.cantidadTeclados[0] &&
        dispositivosStock.cantidadTeles[1] -
          prestamoData.teles +
          dispositivosPrestados.teles <=
          dispositivosStock.cantidadTeles[0]
      ) {
        await db
          .collection("dispositivos")
          .doc("srigtEXGBqFORYznUalA")
          .update({
            notebooksIDs : notebooksPrestadas,
            cantidadNotebooks: [
              dispositivosStock.cantidadNotebooks[0],
              notebooksPrestadas.length
            ],
            
            cantidadAntenas: [
              dispositivosStock.cantidadAntenas[0],
              dispositivosPrestados.antenas,
            ],
            cantidadMouses: [
              dispositivosStock.cantidadMouses[0],
              dispositivosPrestados.mouses,
            ],
            cantidadTeclados: [
              dispositivosStock.cantidadTeclados[0],
              dispositivosPrestados.teclados,
            ],
            cantidadTeles: [
              dispositivosStock.cantidadTeles[0],
              dispositivosPrestados.teles,
            ],
          });

        await db.collection("prestamos").doc(prestamoId).update({
          notebooksCantidad: notebooksSeleccionadas.length,
          idNotebooks: notebooksSeleccionadas,
          antenas: dispositivosPrestados.antenas,
          mouses: dispositivosPrestados.mouses,
          teclados: dispositivosPrestados.teclados,
          teles: dispositivosPrestados.teles,
        });
        window.location.href = "index.html";
        return;
      } else {
        console.log("no se pueden realizar los cambios");
      }
    });
  });

  // Añadir un evento de escucha al botón azul para actualizar el estado del préstamo cuando se hace clic
  botonAzul.addEventListener("click", async () => {
    const prestamoId = carta.getAttribute("data-prestamo-id"); // Obtener el ID del préstamo desde el atributo de datos de la tarjeta

    // Obtener los datos del préstamo
    const prestamoSnapshot = await db
      .collection("prestamos")
      .doc(prestamoId)
      .get();
    const prestamoData = prestamoSnapshot.data();

    // Obtener los IDs de las notebooks prestadas
    const notebooksPrestadas = prestamoData.idNotebooks;

    // Obtener los datos de los dispositivos prestados en el préstamo
    const dispositivosPrestados = {
      notebooks: prestamoData.notebooksCantidad,
      antenas: prestamoData.antenas,
      mouses: prestamoData.mouses,
      teclados: prestamoData.teclados,
      teles: prestamoData.teles,
    };

    // Actualizar el estado del préstamo a "completo"
    await db.collection("prestamos").doc(prestamoId).update({
      estado: "completo",
    });

    // Obtener los datos de los dispositivos en stock
    const dispositivosStockSnapshot = await db
      .collection("dispositivos")
      .doc("srigtEXGBqFORYznUalA")
      .get();
    const dispositivosStock = dispositivosStockSnapshot.data();

    // Actualizar las cantidades de dispositivos en stock
    await db
      .collection("dispositivos")
      .doc("srigtEXGBqFORYznUalA")
      .update({
        cantidadNotebooks: [
          dispositivosStock.cantidadNotebooks[0],
          dispositivosStock.cantidadNotebooks[1] -
            dispositivosPrestados.notebooks,
        ],
        cantidadAntenas: [
          dispositivosStock.cantidadAntenas[0],
          dispositivosStock.cantidadAntenas[1] - dispositivosPrestados.antenas,
        ],
        cantidadMouses: [
          dispositivosStock.cantidadMouses[0],
          dispositivosStock.cantidadMouses[1] - dispositivosPrestados.mouses,
        ],
        cantidadTeclados: [
          dispositivosStock.cantidadTeclados[0],
          dispositivosStock.cantidadTeclados[1] -
            dispositivosPrestados.teclados,
        ],
        cantidadTeles: [
          dispositivosStock.cantidadTeles[0],
          dispositivosStock.cantidadTeles[1] - dispositivosPrestados.teles,
        ],
        notebooksIDs: dispositivosStock.notebooksIDs.filter(
          (id) => !notebooksPrestadas.includes(id)
        ),
      });

    // Eliminar la tarjeta del préstamo de la interfaz después de actualizar el estado
    carta.remove();
    window.location.href = "index.html";
  });
};

const readData = () => {
  db.collection("prestamos")
    .where("estado", "==", "activo") // Filtrar los préstamos por estado "activo"
    .get()
    .then((data) => {
      data.docs.forEach((doc) => {
        const datos = doc.data();
        crearCarta(
          datos.curso,
          datos.profesor,
          datos.notebooksCantidad,
          datos.antenas,
          datos.mouses,
          datos.teclados,
          datos.teles,
          datos.idNotebooks,
          doc.id,
          datos.fechaHorario
        );
      });
    });
};

readData();
