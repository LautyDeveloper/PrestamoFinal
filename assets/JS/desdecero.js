const notebooksContainer = document.querySelector(".content-notebooks");
const confirmaBtn = document.getElementById("enviarPrestamo");
const cartasContainer = document.querySelector(".cartas-container");

let notebookArray = JSON.parse(localStorage.getItem("notebookArray")) || [];
let noDisponibles = JSON.parse(localStorage.getItem("noDisponibles")) || [];

const crearNotebooks = () => {
  const notes = (id) => {
    const notebook = document.createElement("DIV");
    notebook.textContent = `${id}`;
    notebooksContainer.appendChild(notebook);

    if (notebookArray.includes(`${id}`)) {
      notebook.classList.add("seleccionado");
    }
    if (noDisponibles.includes(`${id}`)) {
      notebook.classList.add("no-disponible");
      return;
    }

    notebook.addEventListener("click", () => {
      if (noDisponibles.includes(id)) {
        console.log("NO");
        return;
      }
      if (notebook.classList.contains("seleccionado")) {
        notebook.classList.remove("seleccionado");
        let pos = notebookArray.indexOf(notebook.textContent);
        notebookArray.splice(pos, 1);
        console.log(notebookArray);
        return;
      }
      notebook.classList.add("seleccionado");
      notebookArray.push(notebook.textContent);
      console.log(notebookArray);
    });
  };
  for (let i = 1; i <= 30; i++) {
    notes(i);
  }
};

const valoresDeInput = (loan) => {
  loan = JSON.parse(localStorage.getItem("loanList")) || [];
  let curso = document.getElementById("curso").value;
  let profe = document.getElementById("profe").value;
  let mouse = document.getElementById("mouse").value;
  let antenas = document.getElementById("antenas").value;
  let teles = document.getElementById("tv").value;
  let teclado = document.getElementById("teclado").value;
  let notebooks = notebookArray;

  loan.push({
    curso: curso,
    profesor: profe,
    mouses: mouse,
    antenas: antenas,
    televisores: teles,
    teclados: teclado,
    notebooks: notebooks,
  });

  localStorage.setItem("loanList", JSON.stringify(loan));
};

const crearCarta = (id, loan) => {
  let div = document.createElement("DIV");

  let arriba = document.createElement("DIV");
  arriba.classList.add("arriba", "cursoprofe");

  let cursoProfesor = document.createElement("DIV");
  cursoProfesor.classList.add("curso-profesor");
  cursoProfesor.innerHTML = `<h2>${loan[id].curso}</h2>
                              <p>Prof: ${loan[id].profesor}</p>`;

  let botones = document.createElement("DIV");
  botones.classList.add("botones");

  let botonCompletado = document.createElement("DIV");
  botonCompletado.classList.add("boton", "azul");
  botonCompletado.setAttribute("id", id);
  botonCompletado.innerHTML = `<img src="../assets/media/complete.png" alt="complete button">`;

  botones.appendChild(botonCompletado);

  arriba.appendChild(cursoProfesor);
  arriba.appendChild(botones);

  let contenidoMenos = document.createElement("DIV");
  contenidoMenos.classList.add("contenido", "menos");
  contenidoMenos.innerHTML = `<ul>
  <li>Notebooks:${loan[id].notebooks.length}</li>
  <li>Antenas: ${loan[id].antenas}</li>
  <li>Mouse´s: ${loan[id].mouses}</li>
  <li>Televisores: ${loan[id].televisores}</li>
  <li>Teclado: ${loan[id].teclados}</li>
  </ul>
  <div class="boton">
      <button class="detalles-boton">Detalles</button>
  </div>
  `;
  let contenidoDetalles = document.createElement("DIV");
  contenidoDetalles.classList.add("contenido", "detalles");
  contenidoDetalles.innerHTML = `<ul>
  <li><span>Notebooks:</span> ${loan[id].notebooks}</li>
  <li><span>Antenas:</span> ${loan[id].antenas}</li>
  <li><span>Mouse´s:</span> ${loan[id].mouses}</li>
  <li><span>Televisores:</span> ${loan[id].televisores}</li>
  <li><span>Teclado:</span> ${loan[id].teclados}</li>
</ul>
<div class="boton">
  <button class="mostrar-menos">Mostrar Menos</button>
</div>
  `;

  div.appendChild(arriba);
  div.appendChild(contenidoMenos);
  div.appendChild(contenidoDetalles);

  div.classList.add("carta");
  cartasContainer.appendChild(div);

  botonCompletado.addEventListener("click", () => {
    let prestamo = JSON.parse(localStorage.getItem("loanList")) || [];
    let aEliminar = botonCompletado.getAttribute("id");
    div.remove();
    console.log(prestamo[aEliminar].notebooks);
    noDisponibles = noDisponibles.filter(
      (item) => !prestamo[aEliminar].notebooks.includes(item)
    );

    prestamo.splice(aEliminar, 1);
    localStorage.setItem("loanList", JSON.stringify(prestamo));
    localStorage.setItem("noDisponibles", JSON.stringify(noDisponibles));
    window.location.href = "No_Conex.html";
  });
};

const prestamo = JSON.parse(localStorage.getItem("loanList")) || [];
let tamaño = prestamo.length;

for (let index = 0; index < tamaño; index++) {
  crearCarta(index, prestamo);
}
crearNotebooks();

confirmaBtn.addEventListener("click", () => {
  console.log("HOla");
  valoresDeInput(prestamo);
  noDisponibles += [...notebookArray] + ",";
  noDisponiblesArray = noDisponibles.split(",");
  localStorage.setItem("noDisponibles", JSON.stringify(noDisponiblesArray));
  notebookArray = [];
  localStorage.setItem("notebookArray", JSON.stringify(notebookArray));
  console.log("Valor de notebookArray guar.dado en localStorage.");
});
