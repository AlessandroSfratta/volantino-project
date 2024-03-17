

    const btnVolantinoA4 = document.getElementById("volantinoA4");
    const btnVolantinoWeb = document.getElementById("volantinoWeb");
    const sections = document.querySelectorAll('.form-step');

    export let jsonData = {};

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

            navigaSezione("avanti");
            console.log(scelta);
  
        });
    });
    
    
    
    btnPrev.forEach(button => {
        button.addEventListener("click", () => {
            navigaSezione("indietro");
        }); 
    });


// button reparti 
    const sectionHeaders = document.querySelectorAll('.tail-cont-a4 h2, .tail-cont-web h2');
    sectionHeaders.forEach(function(section) {
        section.addEventListener('click', function() {
            toggleSection(this.id);
        });
    });



    const btnAnteprima1 = document.querySelector('#anteprima1');
    const btnAnteprima2 = document.querySelector('#anteprima2');
    // var btnAnteprima3 = document.querySelector('.anteprima3');
    

    function FoundDataType() {
        let dataType;
        if (scelta.includes('a4')) { dataType = 'volantinoA4'; } 
        else if (scelta.includes('volantino_digitale')) { dataType = 'volantinoWeb'; } 
        else { dataType = 'defaultType'; }
        return dataType;
    }
    


// Funzione per verificare se tutti gli input sono stati compilati correttamente in tutte le sezioni con lo stesso data-type
    function checkInputsInSections() {

        const dataType = FoundDataType();
    
        const sections = document.querySelectorAll(`.form-step[data-type="${dataType}"]`);
    
        let totalInputs = 0; 
        let filledInputs = 0; 
    
        sections.forEach(function(section) {
            // console.log(`Sezione: ${section.id}`);
            let inputsInSection = section.querySelectorAll('input[required]');
    
            totalInputs += inputsInSection.length;
    
            // console.log(totalInputs)
    
 
            inputsInSection.forEach(function(input) {
                if (input.value.trim() !== '') { 
                    filledInputs++;
                }
            });
        });
    
        if (filledInputs === totalInputs) { 
            btnAnteprima1.removeAttribute('disabled'); 
            btnAnteprima2.removeAttribute('disabled'); 
            // console.log("Pulsante 'Anteprima' abilitato.");
        } else {
            
            btnAnteprima1.setAttribute('disabled', 'disabled'); 
            btnAnteprima2.setAttribute('disabled', 'disabled');
            // console.log("Pulsante 'Anteprima' disabilitato.");
        }
    }
    
    document.querySelectorAll('.form-step input').forEach(function(input) {
        input.addEventListener('change', checkInputsInSections);
    });
  




    function toggleSection(sectionId) {

        const currentSection = document.querySelector('.form-step[style="display: block;"]');
    
        if (currentSection) {

            currentSection.style.display = 'none';
    
            const secClass = Array.from(currentSection.classList).find(className => className.startsWith('sec'));
    
            if (secClass) {

                const button = document.getElementById(secClass);
    
                const requiredInputs = currentSection.querySelectorAll('input[required]');
    
                let allInputsValid = true;
    
                requiredInputs.forEach(function(input) {
                    if (!input.value.trim()) {
                        allInputsValid = false;
                    }
                });
    
                if (!allInputsValid) {
                    button.style.backgroundColor = '#FF8C00';
                } else {
                    button.style.backgroundColor = '#7cfc00';
                }
            }
        }
    
        // Mostra la sezione target
        const targetSection = document.querySelector(`.${sectionId}`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    
    
    
    


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
    

            if (sections[1].style.display === "block") {
                if (scelta == "a4") {  
                    document.querySelector(".tail-cont-a4").style.display = "flex";
                    document.querySelector(".tail-cont-web").style.display = "none";
                }
            }

            if (sections[3].style.display === "block") {
                if (scelta == "volantino_digitale") {
                    document.querySelector(".tail-cont-web").style.display = "flex";
                    document.querySelector(".tail-cont-a4").style.display = "none";
                }
            }
            
            // //prima section && section anteprime
            // if(sections[0].style.display === "block" || sections[4].style.display === "block" || sections[5].style.display === "block"  ) {
            //     document.querySelector(".tail-cont-web").style.display = "none";
            //     document.querySelector(".tail-cont-a4").style.display = "none";
            // }
     
    
    
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

        document.querySelector(".tail-cont-web").style.display = "none";
        document.querySelector(".tail-cont-a4").style.display = "none";
    
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
    


    
// Seleziona tutti gli input-nome-prodotto
const inputsNomeProdotto = document.querySelectorAll('.input-nome-prodotto');

// Aggiungi un listener per l'evento input a tutti gli input con classe .input-nome-prodotto
inputsNomeProdotto.forEach(input => {
    input.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase();
        
        const dataType = this.dataset.type; // Ottieni il dataType dall'elemento specifico
        
        prelevaProdotto(searchText, dataType, this); // Passa il dataType e l'input corrente alla funzione prelevaProdotto
    });
});



// Aggiungi un listener per l'evento mouseleave sul container .input-row
const inputRows = document.querySelectorAll('.input-row');
inputRows.forEach(function(inputRow) {
    inputRow.addEventListener('mouseleave', function() {
        const productList = this.querySelectorAll(".suggerimenti-nome-prodotto select");
        
        productList.forEach(function(select) {
            select.style.display = "none";
        });
    });
});




function prelevaProdotto(searchText, dataType, input) {

    const filePath = 'archivioUTF8.csv';

    Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
            const productListContainer = input.parentElement.querySelector('.suggerimenti-nome-prodotto select');
            productListContainer.innerHTML = '';

            let hasMatches = false;

            results.data.forEach(row => {

                const prodotto = row["Nome prodotto"];

                if (prodotto.toLowerCase().includes(searchText)) {

                    const option = document.createElement('option');
                    option.value = prodotto;
                    option.textContent = prodotto;
                    productListContainer.appendChild(option);
                    hasMatches = true;

                    option.addEventListener('click', function() {
                        input.value = this.value;
                        productListContainer.style.display = "none";
                        const immagine = input.closest('.input-row').querySelector('.cont-scelta-img img');
                        if (immagine) {
                            const linkImmagine = row["immagine"];
                            immagine.src = linkImmagine;
                        } else {
                            console.error('Elemento immagine non trovato.');
                        }
                    });
                }
            });

            productListContainer.style.display = dataType === input.dataset.type && hasMatches ? 'block' : 'none';
        },
        error: function(error) {
            console.error('Errore durante il recupero del file:', error);
        }
    });
}




// Seleziona tutti gli elementi <label> associati ai toggle
const toggleLabels = document.querySelectorAll('.switch label');

// Itera su ciascun elemento label
toggleLabels.forEach(function(label) {
    label.addEventListener("click", function() {

        const input = this.previousElementSibling;

        let container = this.closest('.input-row');

        // Verifica se l'elemento input non è selezionato
        if (!input.checked) {
            // Se non è selezionato, seleziona tutti gli input richiesti e le immagini nello stesso contenitore
            const requiredInputs = container.querySelectorAll('input[required]');
            const imgs = container.querySelectorAll('img');
            const contImgs = container.querySelectorAll('.cont-scelta-img');

            // Variabile per verificare se tutti gli elementi sono presenti
            let allElementsPresent = true;

            // Itera su ciascuna immagine nello stesso contenitore
            imgs.forEach(function(img) {
                // Verifica se l'immagine ha un attributo src
                if (!img.getAttribute('src')) {
                    // Se l'attributo src è assente, imposta lo stile di sfondo sul contenitore dell'immagine
                    console.log('L\'attributo src dell\'immagine è vuoto.');
                    contImgs.forEach(function(contImg) {
                        contImg.style.border = " 1px solid red";
                    });
                    allElementsPresent = false;
                } else {
                    contImgs.forEach(function(contImg) {
                        contImg.style.border = "1px solid green";
                    });
                }
            });

            // Itera su ciascun input richiesto
            requiredInputs.forEach(function(requiredInput) {
                // Verifica se l'input ha del contenuto
                if (!requiredInput.value.trim()) {
                    requiredInput.style.border = '1px solid red';
                    allElementsPresent = false;
                } else {
                    requiredInput.style.border = '';
                }
            });


      // Se tutti gli elementi sono presenti, contrassegna il bordo come verde
if (allElementsPresent) {
    requiredInputs.forEach(function(requiredInput) {
        requiredInput.style.border = '1px solid green';

    });

    // Seleziona tutti i container modal
    const modalContainers = container.querySelectorAll('.modal');

    // Aggiungi la classe 'active' a ciascun container modal
    modalContainers.forEach( (modal) => {
        modal.classList.add('active-modal');
    })

    addToJson(container);

}
            // Se ci sono elementi mancanti, applica il click dopo 500 millisecondi
            if (!allElementsPresent) {
                setTimeout(function() {
                    label.click(); // Simula un click sul pulsante
                }, 500);
            }

        } else {

            const modalContainers = container.querySelectorAll('.modal');
                // Aggiungi la classe 'active' a ciascun container modal

                modalContainers.forEach( (modal) => {
                    modal.classList.remove('active-modal');
                }) 

                removeFromJson(container);
        }

    });
});




// Contatore per tenere traccia del numero di prodotti
let productCounter = 1;
// Funzione per aggiungere i valori degli input al JSON
function addToJson(container) {
    const nomeProdottoInput = container.querySelector('.input-nome-prodotto');
    const nomeProdotto = nomeProdottoInput.value;
    const description = container.querySelector('.input-descrizione').value;
    const price = container.querySelector('.input-prezzo').value;
    const image = container.querySelector('.cont-scelta-img img').src;

    // Costruisci la chiave del prodotto
    const productKey = `prodotto${productCounter}`;

    // Aggiungi i valori al JSON utilizzando il nome del prodotto come chiave
    jsonData[productKey] = {
        "nomeProdotto": nomeProdotto,
        "Descrizione": description,
        "Prezzo": price,
        "Immagine": image,
        "productKey": productKey // Salva la chiave del prodotto come attributo data-
    };

    // Salva la chiave del prodotto come attributo data-nome-prodotto
    nomeProdottoInput.dataset.productKey = productKey;

    console.log(jsonData);

    // Incrementa il contatore dei prodotti
    productCounter++;
}

// Funzione per rimuovere i valori degli input dal JSON
function removeFromJson(container) {
    const nomeProdottoInput = container.querySelector('.input-nome-prodotto');
    const nomeProdotto = nomeProdottoInput.value;
    const productKey = nomeProdottoInput.dataset.productKey; // Ottieni la chiave del prodotto dal dataset

    // Rimuovi i valori dal JSON utilizzando la chiave del prodotto
    delete jsonData[productKey];

    console.log(jsonData);
}




// // Funzione per aggiornare il contatore
// function updateCounter(change) {
//     const counterElement = document.querySelectorAll('#counter');
//     if (counterElement) {
        
//         counterElement.forEach((counter) => {

//             let currentCount = parseInt(counter.textContent) || 0;
//             currentCount += change;
//             counter.textContent = currentCount.toString();

//         })

 
//     }
// }



// // Seleziona entrambi gli elementi di input per la ricerca
// const searchInputs = document.querySelectorAll('.search-input');

// // Aggiungi un listener per gestire gli eventi di input della ricerca per ciascun input
// searchInputs.forEach(searchInput => {
//     searchInput.addEventListener('input', handleSearch);
// });




// // Funzione per gestire la ricerca degli elementi
// function handleSearch(event) {
//     const searchText = event.target.value.toLowerCase(); // Ottieni il testo digitato e convertilo in minuscolo
//     const rows = document.querySelectorAll('.row-container'); // Seleziona tutte le righe

//     rows.forEach(row => {
//         // Ottieni il testo contenuto in ogni riga e convertilo in minuscolo
//         const rowText = row.textContent.toLowerCase();

//         // Verifica se il testo della riga contiene il testo digitato nella ricerca
//         if (rowText.includes(searchText)) {
//             // Se la riga corrisponde al testo di ricerca, mostra la riga
//             row.style.display = '';
//         } else {
//             // Altrimenti, nascondi la riga
//             row.style.display = 'none';
//         }
//     });
// }




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
