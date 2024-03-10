

    const btnVolantinoA4 = document.getElementById("volantinoA4");
    const btnVolantinoWeb = document.getElementById("volantinoWeb");
    const sections = document.querySelectorAll('.form-step');

    let scelta;

    btnVolantinoA4.addEventListener("click", () => {
        scelta = "a4";
        aggiungiDataTypeToArray(btnVolantinoA4.dataset.type); 
        btnVolantinoA4.classList.add("active");
        btnVolantinoWeb.classList.remove("active");
    });

    btnVolantinoWeb.addEventListener("click", () => {
        scelta = "volantino_digitale";
        console.log(scelta);
        aggiungiDataTypeToArray(btnVolantinoWeb.dataset.type);
        btnVolantinoWeb.classList.add("active");
        btnVolantinoA4.classList.remove("active");
    });
    
    
 
    const btnNext = document.querySelectorAll(".btn-next");
    const btnPrev = document.querySelectorAll(".btn-pre");
    

    btnNext.forEach(button => {
        button.addEventListener("click", () => {
 
            if (sections[1].style.display !== "none") {
                if (scelta == "a4" && Object.keys(jsonData).length !== 15) {
                    alert("Seleziona tutti e 15 gli elementi prima di proseguire.");
                    return;
                }
            }

            if (sections[2].style.display !== "none") {
                if (scelta == "volantino_digitale" && Object.keys(jsonData).length !== 147) {
                    alert("Seleziona tutti e 147 gli elementi prima di proseguire.");
                    return;
                }
            }
            

            navigaSezione("avanti");
            console.log(scelta);
  
        });
    });
    
    
    
    btnPrev.forEach(button => {
        button.addEventListener("click", () => {
            navigaSezione("indietro");
        }); 
    });
    
    
    
    let sezioniPassate = [];
    let currentDataType = [];
    
    
    function aggiungiDataTypeToArray(tipo) {
        if (tipo === null) {
            console.log("Valore fittizio, non proseguire.");
            return; 
        }
        if (currentDataType[0] !== tipo && tipo) {
            currentDataType = [tipo];
            console.log("Data-type aggiunto all'array:", tipo);
        } else {
            return;
        }
    }



    
    function navigaSezione(direzione) {
        
        const tutteLeSezioni = Array.from(document.querySelectorAll('.form-step'));
        const sezioneAttualmenteVisibile = tutteLeSezioni.find(section => section.getBoundingClientRect().height > 0);
        
        const sezioniFiltrate = tutteLeSezioni.filter(section => section.dataset.type === currentDataType[0]);
        let indiceAttuale = sezioniFiltrate.indexOf(sezioneAttualmenteVisibile);
        let prossimoIndice = (indiceAttuale + 1) % sezioniFiltrate.length;
            
    
        if (direzione === "avanti") {
    
            
            if (sezioniFiltrate.length === 0) {
                console.log("Nessuna sezione è stata trovata per il data-type corrente.");
                return;
            } 
     
        if (prossimoIndice < indiceAttuale) {
             console.log("Non ci sono altre sezioni disponibili con lo stesso data-type in avanti.");
             return;
         } else {
            sezioneAttualmenteVisibile.style.display = 'none';
         }
    
            if (sezioniFiltrate[prossimoIndice]) {
                sezioniFiltrate[prossimoIndice].style.display = 'block';
                if (!sezioniPassate.includes(sezioniFiltrate[prossimoIndice])) {
                    sezioniPassate.push(sezioniFiltrate[prossimoIndice]);
                }
            }
    
     
    
    
    } else if (direzione === "indietro") {

        if (indiceAttuale === 0) {
            resetAll();
            return;
        }
    
        aggiungiDataTypeToArray(sezioneAttualmenteVisibile.dataset.type);
    
        if (sezioneAttualmenteVisibile ) {
            sezioneAttualmenteVisibile.style.display = 'none';
        }
    
            if (sezioniPassate.length > 1) {
                sezioniPassate.pop();
                const sezioneDaMostrare = sezioniPassate[sezioniPassate.length - 1];
                sezioneDaMostrare.style.display = 'block';
            } else {
                const sezioneIniziale = tutteLeSezioni.find(section => section.dataset.type === 'start');
                if (sezioneIniziale) {
                    sezioneIniziale.style.display = 'block';
                }
                currentDataType = ['start'];
                sezioniPassate = [sezioneIniziale]; 
            }
        
        }
    }



    function resetAll() {
        // Rimuovi la classe 'active' da tutti i pulsanti
        btnVolantinoA4.classList.remove("active");
        btnVolantinoWeb.classList.remove("active");
    
        // Resetta gli array e il JSON
        sezioniPassate = [];
        currentDataType = [];
        jsonData = {};
    
        // Rimuovi l'anteprima CSV
        clearPreview();
    
        const container = document.querySelector('.tendina');
        container.style.display = 'none';
    
        // Mostra solo la prima sezione
        const tutteLeSezioni = Array.from(document.querySelectorAll('.form-step'));
        tutteLeSezioni.forEach(sezione => {
            if (sezione.dataset.type === 'start') {
                sezione.style.display = 'block';
            } else {
                sezione.style.display = 'none';
            }
        });
    }
    

    
    function hideElement(element) {
        if (element) {
          element.style.display = 'none';
        } else {
            console.log("Elemento non trovato")
        }
      }
    
    
    
    function showElement(element) {
      if (element) {
        element.style.display = "block";
      } else {
        console.log("Elemento non trovato");
      }
    }
    

    const anteprimaCsvDiv1 = document.querySelector('.anteprima_csv1');
    const anteprimaCsvDiv2 = document.querySelector('.anteprima_csv2');
    
    document.getElementById('csvFileA4').addEventListener('change', handleFileSelect);
    document.getElementById('csvFileWeb').addEventListener('change', handleFileSelect);

    

function handleFileSelect(event) {
    const file = event.target.files[0];
    jsonData = {};
    clearPreview();


    Papa.parse(file, {
        encoding: "UTF-8",
        skipEmptyLines: true,
        complete: function(results) {
            console.log(results);
            if (scelta === "a4") {
                showCsvContent(results.data, anteprimaCsvDiv1);
            } else if (scelta === "volantino_digitale") {
                showCsvContent(results.data, anteprimaCsvDiv2);
            } else {
                console.log("Devi selezionare un tipo di volantino prima di aggiungere elementi.");
            }
        }
    });
}


function clearPreview() {
    const anteprimaCsvDiv1 = document.querySelector('.anteprima_csv1');
    const anteprimaCsvDiv2 = document.querySelector('.anteprima_csv2');

    while (anteprimaCsvDiv1.firstChild) {
        anteprimaCsvDiv1.removeChild(anteprimaCsvDiv1.firstChild);
    }

    while (anteprimaCsvDiv2.firstChild) {
        anteprimaCsvDiv2.removeChild(anteprimaCsvDiv2.firstChild);
    }
}




function showCsvContent(data) {

    const columnIndexFotoProdotto = data[0].indexOf("FOTO PRODOTTO");

    for (let i = 1; i < data.length; i++) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');

        data[i].forEach((cell, index) => {
            if (index === columnIndexFotoProdotto) {
                return;
            }

            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            rowContainer.appendChild(cellElement);
        });

        const imgUrl = data[i][columnIndexFotoProdotto];
        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.style.width = '200px';
        imgElement.style.height = '200px';
        imgElement.style.display = 'block';
        imgElement.alt = 'Immagine prodotto';

        rowContainer.appendChild(imgElement);

        // Determina quale anteprima mostrare in base al contenuto di scelta
        const anteprimaContainer = scelta === "a4" ? document.querySelector('.anteprima_csv1') : document.querySelector('.anteprima_csv2');
        if (anteprimaContainer) {
            anteprimaContainer.appendChild(rowContainer);
        } else {
            console.error("Elemento anteprima non trovato:", scelta);
        }
    }

  // Modifica lo stile delle tendine in base alla scelta
  const containerA4 = document.querySelector('.form-step.sec1 .tendina');
  const containerWeb = document.querySelector('.form-step.sec2 .tendina');
  if (scelta === "a4" && containerA4) {
      containerA4.style.display = 'block';
      containerA4.style.height = '300px'; // Modifica l'altezza per la tendina A4
  } else if (scelta === "volantino_digitale" && containerWeb) {
      containerWeb.style.display = 'block';
      containerWeb.style.height = '500px'; // Modifica l'altezza per la tendina Web
  } else {
      console.error("Scelta non valida:", scelta);
  }
}


// Dichiarazione globale della variabile jsonData
export let jsonData = {};


// Aggiungi il nuovo listener degli eventi per tutte le anteprime CSV
const anteprimeCsvDivs = document.querySelectorAll('.anteprima_csv1, .anteprima_csv2');
anteprimeCsvDivs.forEach(anteprimaCsvDiv => {
    anteprimaCsvDiv.addEventListener('click', handleClick);
});



function handleClick(event) {
    const target = event.target;
    let limiteMassimoElementi; // Imposta il limite predefinito a 15

    // Verifica se la variabile scelta è "a4" o "volantino_digitale" e imposta il limite massimo di conseguenza
    if (scelta === "a4") {
        limiteMassimoElementi = 15;
    } else if (scelta === "volantino_digitale") {
        limiteMassimoElementi = 142;
    } else {
        console.log("Devi selezionare un tipo di volantino prima di aggiungere elementi.");
        return;
    }

    if (target.classList.contains('row-container')) {
        const isActive = target.classList.contains('active');
        if (isActive) {
            target.classList.remove('active');
            removeRowFromJson(target);
        } else {
            if (numeroProdotto <= limiteMassimoElementi) { // Utilizza il limite massimo dinamico
                target.classList.add('active');
            }
            addRowToJson(target);
        }
        console.log(jsonData);
    }
}



// Variabile per tener traccia del numero di prodotti aggiunti
let numeroProdotto = 1;

// Funzione per aggiungere l'elemento al JSON
function addRowToJson(row) {
    let numeroElementiRichiesti = 0;

    if (scelta === "a4") {
        numeroElementiRichiesti = 15;
    } else if (scelta === "volantino_digitale") {
        numeroElementiRichiesti = 142;
    } else {
        console.log("Devi selezionare un tipo di volantino prima di aggiungere elementi.");
        return;
    }

    // Verifica se il limite massimo di elementi è stato raggiunto
    if (Object.keys(jsonData).length >= numeroElementiRichiesti) {
        console.log("Limite massimo di elementi raggiunto.");
        return;
    }

    const rowData = {

        "Nome_Prodotto": row.querySelector('.cell:nth-child(1)').textContent,
        "Descrizione": row.querySelector('.cell:nth-child(2)').textContent,
        "Prezzo": row.querySelector('.cell:nth-child(3)').textContent,
        "Immagine": row.querySelector('img').src
        
    };

    // Costruisci la chiave utilizzando la stringa "Prodotto" seguita dal numero di prodotto
    const key = "Prodotto" + numeroProdotto;

    // Aggiungi l'elemento al JSON utilizzando la chiave esterna "Prodotto" seguita dal numero di prodotto
    jsonData[key] = rowData;

    // Incrementa il numero di prodotto per il prossimo elemento
    numeroProdotto++;

    // Incrementa il contatore
    updateCounter(1);
}


// Funzione per rimuovere l'elemento dal JSON
function removeRowFromJson(row) {
    const productName = row.querySelector('.cell:nth-child(1)').textContent;
    let keyToRemove = null;

    // Cerca la chiave corrispondente all'elemento da rimuovere nel JSON
    Object.keys(jsonData).forEach(key => {
        if (jsonData[key]["Nome_Prodotto"] === productName) {
            keyToRemove = key;
        }
    });

    // Se la chiave è stata trovata, rimuovi l'elemento corrispondente dal JSON
    if (keyToRemove !== null) {
        
        delete jsonData[keyToRemove];

        numeroProdotto--;
        // Decrementa il contatore
        updateCounter(-1);

    } else {
        console.log("Elemento non trovato nel JSON.");
    }
}


// Funzione per aggiornare il contatore
function updateCounter(change) {
    const counterElement = document.querySelectorAll('#counter');
    if (counterElement) {
        
        counterElement.forEach((counter) => {

            let currentCount = parseInt(counter.textContent) || 0;
            currentCount += change;
            counter.textContent = currentCount.toString();

        })

 
    }
}



// Seleziona entrambi gli elementi di input per la ricerca
const searchInputs = document.querySelectorAll('.search-input');

// Aggiungi un listener per gestire gli eventi di input della ricerca per ciascun input
searchInputs.forEach(searchInput => {
    searchInput.addEventListener('input', handleSearch);
});

// Funzione per gestire la ricerca degli elementi
function handleSearch(event) {
    const searchText = event.target.value.toLowerCase(); // Ottieni il testo digitato e convertilo in minuscolo
    const rows = document.querySelectorAll('.row-container'); // Seleziona tutte le righe

    rows.forEach(row => {
        // Ottieni il testo contenuto in ogni riga e convertilo in minuscolo
        const rowText = row.textContent.toLowerCase();

        // Verifica se il testo della riga contiene il testo digitato nella ricerca
        if (rowText.includes(searchText)) {
            // Se la riga corrisponde al testo di ricerca, mostra la riga
            row.style.display = '';
        } else {
            // Altrimenti, nascondi la riga
            row.style.display = 'none';
        }
    });
}




// // Seleziona tutte le righe
// const rows = document.querySelectorAll('.row-container');

// // Aggiungi un listener a ciascuna riga
// rows.forEach((row, index) => {
//     // Imposta il numero del prodotto come attributo del dataset
//     row.dataset.prodottoNumero = index + 1;

//     row.addEventListener('click', () => {
//         // Verifica se la riga ha già la classe 'active'
//         const isActive = row.classList.contains('active');

//         if (isActive) {
//             // Rimuovi la classe 'active' dalla riga
//             row.classList.remove('active');

//             // Rimuovi l'elemento corrispondente dal JSON
//             removeRowFromJson(row);
//         } else {

//         // Verifica se è possibile selezionare l'elemento
// if (Object.keys(jsonData).length <= 15) {
//     // Aggiungi la classe 'active' al contenitore solo se è possibile selezionarlo
//     row.classList.add('active');
// }

//             // Aggiungi l'elemento corrispondente al JSON
//             addRowToJson(row);
//         }
//     });
// });
