const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBtiovCGbcBl0x9Y9ANq8HLP_ETScYBsrA",
    authDomain: "prestamodenotebooks-3745b.firebaseapp.com",
    projectId: "prestamodenotebooks-3745b",
    storageBucket: "prestamodenotebooks-3745b.appspot.com",
    messagingSenderId: "869282035859",
    appId: "1:869282035859:web:d460cc08b22194220a3566",
  });
  
  export const db = firebaseApp.firestore();

const cartasContainer = document.querySelector(".cartas-container");


const createCard = (curso, profesor, note, mouse, antenas, teclados, tv, id, fechaHora) =>{

    const carta = document.createElement("DIV");

    carta.innerHTML = `
    <div class="carta">
    <div class="arriba cursoprofe">
      <div class="curso-profesor">
        <h2>${curso}</h2>
        <p>Prof: ${profesor}</p>
      </div>
    </div>
    <div class="contenido detalles">
      <ul>
        <li>
          <span>Notebooks:</span>
          ${note}
        </li>
        <li><span>Antenas:</span> ${antenas}</li>
        <li><span>Mouse´s:</span> ${mouse}</li>
        <li><span>Televisores:</span> ${tv}</li>
        <li><span>Teclado:</span> ${teclados}</li>
      </ul>
    </div>
    <div class="fecha">
      <p>${fechaHora}</p>
    </div>
  </div>
    `;

    cartasContainer.appendChild(carta);
}

const readData = () => {
    db.collection("prestamos")
      .where("estado", "==", "completo") // Filtrar los préstamos por estado "completo"
      .get()
      .then((data) => {
        data.docs.forEach((doc) => {
          const datos = doc.data();
          createCard(
            datos.curso,
            datos.profesor,
            datos.idNotebooks,
            datos.mouses,
            datos.antenas,
            datos.teclados,
            datos.teles,
            doc.id,
            datos.fechaHorario
          )
        });
      });
  };

  readData();