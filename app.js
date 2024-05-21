

    const btnVolantinoA4 = document.getElementById("volantinoA4");
    const btnVolantinoWeb = document.getElementById("volantinoWeb");
    const sections = document.querySelectorAll('.form-step');

    export let jsonData = {};

   
    let scelta = null;

export function getScelta() { return scelta; }

export function setScelta(nuovaScelta) { scelta = nuovaScelta;}

btnVolantinoA4.addEventListener("click", () => {
    setScelta("a4");
    aggiungiDataTypeToArray(btnVolantinoA4.dataset.type);
    btnVolantinoA4.classList.add("active");
    btnVolantinoWeb.classList.remove("active");
    console.log("Ecco la scelta", getScelta());
});

btnVolantinoWeb.addEventListener("click", () => {
    setScelta("volantino_digitale");
    aggiungiDataTypeToArray(btnVolantinoWeb.dataset.type);
    btnVolantinoWeb.classList.add("active");
    btnVolantinoA4.classList.remove("active");
    console.log("Ecco la scelta", getScelta());
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



// ricarica premendo home
    document.querySelectorAll(".home").forEach((btn) => {
        btn.addEventListener("click", () => {
            location.reload();
        });
    });



// button reparti 
    const sectionHeaders = document.querySelectorAll('.tail-cont-a4 h2, .tail-cont-web h2');
    sectionHeaders.forEach(function(section) {
        section.addEventListener('click', function() {
            toggleSection(this.id);
        });
    });



    const btnAnteprima = document.querySelectorAll('.anteprima');

    

    function FoundDataType() {
        let dataType;
        if (scelta.includes('a4')) { dataType = 'volantinoA4'; } 
        else if (scelta.includes('volantino_digitale')) { dataType = 'volantinoWeb'; } 
        else { dataType = 'defaultType'; }
        return dataType;
    }
    


//verifica se tutti gli input sono stati compilati correttamente in tutte le sezioni con lo stesso data-type
function checkInputsInSections() {

    const dataType = FoundDataType();

    const sections = document.querySelectorAll(`.form-step[data-type="${dataType}"]`);

    let totalInputs = 2;
    let filledInputs = 2;
    let allModalsActive = true;




    sections.forEach(function(section) {
        let inputsInSection = section.querySelectorAll('input[required]');
        let modalsInSection = section.querySelectorAll('.modal');

        // totalInputs += inputsInSection.length;
//decommentare totalInputs per controllo input
       

        inputsInSection.forEach(function(input) {
            if (input.value.trim() !== '') {
                // filledInputs++;
            }
        });

        modalsInSection.forEach(function(modal) {
            if (!modal.classList.contains('active-modal')) {
                allModalsActive = false;
            }
        });
    });

    // if (filledInputs === totalInputs && allModalsActive) {
        if (filledInputs === 2) {
        btnAnteprima.forEach(btn => { btn.removeAttribute('disabled'); });
    } else {
        btnAnteprima.forEach(btn => { btn.setAttribute('disabled', 'disabled'); });
    }
}

    

function addEventListenersToInputs() {
    let inputs = document.querySelectorAll('.form-step input');
    inputs.forEach(function(input) {
        input.addEventListener('change', checkInputsInSections);
    });
}

addEventListenersToInputs();




    function toggleSection(sectionId) {

        const currentSection = document.querySelector('.form-step[style="display: block;"]');
    
        if (currentSection) {

            currentSection.style.display = 'none';
    
            const secClass = Array.from(currentSection.classList).find(className => className.startsWith('sec'));
    
            if (secClass) {

                const button = document.getElementById(secClass);
    
                const requiredInputs = currentSection.querySelectorAll('input[required]');
                    const modals = currentSection.querySelectorAll('.modal');
                    
                    let allInputsValid = true;
                    let allModalsActive = true;
                    
                    requiredInputs.forEach(function(input) {
                        if (!input.value.trim()) {
                            allInputsValid = false;
                        }
                    });
                    
                    modals.forEach(function(modal) {
                        if (!modal.classList.contains('active-modal')) {
                            allModalsActive = false;
                        }
                    });
                    
                    if (!allInputsValid || !allModalsActive) {
                        button.style.backgroundColor = '#FF8C00'; // Arancione se gli input non sono validi o i modali non sono attivi
                    } else {
                        button.style.backgroundColor = '#7cfc00'; // Verde se tutti gli input sono validi e i modali sono attivi
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



    function pagesButtonBlock () { 

        if (sections[1].style.display === "block") {
            if (scelta === "a4") {  
                document.querySelector(".tail-cont-a4").style.display = "flex";
                document.querySelector(".tail-cont-web").style.display = "none";
            }
        }

        if (sections[3].style.display === "block") {
            if (scelta === "volantino_digitale") {
                document.querySelector(".tail-cont-web").style.display = "flex";
                document.querySelector(".tail-cont-a4").style.display = "none";
            }
        }


        if (sections[11].style.display === "block") {
            if (scelta === "a4") {
                document.querySelector(".tail-cont-web").style.display = "none";
                document.querySelector(".tail-cont-a4").style.display = "none";
            }
        }

        if (sections[12].style.display === "block") {
            if (scelta === "volantino_digitale") {
                document.querySelector(".tail-cont-web").style.display = "none";
                document.querySelector(".tail-cont-a4").style.display = "none";
            }
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
    
            pagesButtonBlock();

            
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

            pagesButtonBlock();
        
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
    


    
// funzione evento input sugli input-nome-prodotto
function handleInputNomeProdotto(event) {
    const searchText = event.target.value.trim().toLowerCase();
    const dataType = event.target.dataset.type;
    prelevaProdotto(searchText, dataType, event.target);
}

document.addEventListener('input', function(event) {
    if (event.target.classList.contains('input-nome-prodotto')) {
        handleInputNomeProdotto(event);
    }
});



// funzione mouseleave 
function addEventListenerMouseLeave() {
    // Seleziona tutti gli elementi .input-row
    const inputRows = document.querySelectorAll('.input-row');
    
    // Aggiungi un listener per l'evento mouseleave a tutti gli elementi .input-row
    inputRows.forEach(function(inputRow) {
        inputRow.addEventListener('mouseleave', function() {
            const productList = this.querySelectorAll(".suggerimenti-nome-prodotto select");
            productList.forEach(function(select) {
                select.style.display = "none";
            });
        });
    });
}

addEventListenerMouseLeave();




function prelevaProdotto(searchText, dataType, input) {

    const filePath = 'archivioUTF8.csv';

    Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
            const productListContainer = input.parentElement.querySelector('.suggerimenti-nome-prodotto select');
            productListContainer.innerHTML = '';
            
            console.log("Test click")

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




export function repeatLabelInteraction() {
    const parentElement = document; 

    parentElement.addEventListener("click", function(event) {

        if (event.target.matches('.switch label')) {
            const label = event.target;
            const input = label.previousElementSibling;
            let container = label.closest('.input-row');
            const formStepContainer = label.closest('.form-step');
            const pagina = formStepContainer.getAttribute('data-pagina');

            if (!input.checked) {
                const requiredInputs = container.querySelectorAll('input[required]');
                const imgs = container.querySelectorAll('img');
                const contImgs = container.querySelectorAll('.cont-scelta-img');


                let allElementsPresent = true;

                imgs.forEach(function(img) {
                    if (!img.getAttribute('src')) {
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

                requiredInputs.forEach(function(requiredInput) {
                    if (!requiredInput.value.trim()) {
                        requiredInput.style.border = '1px solid red';
                        allElementsPresent = false;
                    } else {
                        requiredInput.style.border = '';
                    }
                });

                if (allElementsPresent) {
                    requiredInputs.forEach(function(requiredInput) {
                        requiredInput.style.border = '1px solid green';
                    });

                    const modalContainers = container.querySelectorAll('.modal');

                    modalContainers.forEach((modal) => {
                        modal.classList.add('active-modal');
                    });
                }

                if (!allElementsPresent) {
                    setTimeout(function() {
                        label.click();
                    }, 500);
                } else {
                    addToJson(container, pagina);
                }

            } else {
                const modalContainers = container.querySelectorAll('.modal');
                modalContainers.forEach((modal) => {
                    modal.classList.remove('active-modal');
                });
                removeFromJson(container);
            }
        }
    });
}

repeatLabelInteraction();






let productCounter = 1;

function getVisualPosition(container) {

    const inputRows = document.querySelectorAll('.input-row');
    let position = 1;
    
    inputRows.forEach((row, index) => {
        if (row === container) {
            position = index + 1;
            return;
        }
    });

    return position;

}





function addToJson(container, pagina) {

    const nomeProdottoInput = container.querySelector('.input-nome-prodotto');
    const nomeProdotto = nomeProdottoInput.value;
    const description = container.querySelector('.input-descrizione').value;
    const euro = container.querySelector('.euro').value;
    const cent = container.querySelector('.centesimi').value;
   
    const image = container.querySelector('.cont-scelta-img img').src;
    const productKey = `prodotto${productCounter}`;

    const newProduct = {

        "nomeProdotto": nomeProdotto,
        "Descrizione": description,
        "Euro": euro,
        "Centesimi": cent,
        "Immagine": image,
        "productKey": productKey,
        "Pagina": pagina

    };


    if (Object.keys(jsonData).length === 0) {
        jsonData[productKey] = newProduct;
    } else {
        const visualPosition = getVisualPosition(container);
        console.log("Visual Position:", visualPosition);

        let newData = {};
        let inserted = false;
        let currentPosition = 1;

        // Itera elementi di jsonData
        for (let key in jsonData) {
            const product = jsonData[key];
            
            if (product.Pagina === pagina) {
                if (currentPosition === visualPosition) {
                    newData[productKey] = newProduct;
                    inserted = true;
                }
                newData[key] = product;
                currentPosition++;
            } else {
                newData[key] = product;
            }
        }

        if (!inserted) {
            newData[productKey] = newProduct;
        }

        jsonData = { ...newData };
    }

    nomeProdottoInput.dataset.productKey = productKey;

    console.log("jsonData after insertion:", jsonData);

    productCounter++;
}













// Funzione per rimuovere i valori degli input dal JSON
function removeFromJson(container) {

    const nomeProdottoInput = container.querySelector('.input-nome-prodotto');
    const nomeProdotto = nomeProdottoInput.value;
    const productKey = nomeProdottoInput.dataset.productKey; // Ottieni la chiave del prodotto dal dataset

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
