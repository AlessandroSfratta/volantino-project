

    const btnVolantinoA4 = document.getElementById("volantinoA4");
    const btnVolantinoWeb = document.getElementById("volantinoWeb");
    const btnCartellino = document.getElementById("cartellino");
    const sections = document.querySelectorAll('.form-step');

    export let jsonData = {};

   
    let scelta = null;

export function getScelta() {  return scelta;  }

export function setScelta(nuovaScelta) { scelta = nuovaScelta;}

btnVolantinoA4.addEventListener("click", () => {
    setScelta("a4");
    aggiungiDataTypeToArray(btnVolantinoA4.dataset.type);
    btnVolantinoA4.classList.add("active");
    btnVolantinoWeb.classList.remove("active");
    btnCartellino.classList.remove("active");
    console.log("Ecco la scelta", getScelta());
});

btnVolantinoWeb.addEventListener("click", () => {
    setScelta("volantino_digitale");
    aggiungiDataTypeToArray(btnVolantinoWeb.dataset.type);
    btnVolantinoWeb.classList.add("active");
    btnVolantinoA4.classList.remove("active");
    btnCartellino.classList.remove("active");
    console.log("Ecco la scelta", getScelta());
});

btnCartellino.addEventListener("click", () => {
    setScelta("cartellini");
    aggiungiDataTypeToArray(btnCartellino.dataset.type);
    btnCartellino.classList.add("active");
    btnVolantinoWeb.classList.remove("active");
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
            displayLoginLogout("login")
        });
    });







    const btnAnteprima = document.querySelectorAll('.anteprima');
    

    function FoundDataType() {
        let dataType;
        if (scelta.includes('a4')) { dataType = 'volantinoA4'; } 
        else if (scelta.includes('volantino_digitale')) { dataType = 'volantinoWeb'; } 
        else if (scelta.includes('cartellini')) { dataType = 'cartellini'; } 
        else { dataType = 'defaultType'; }
        return dataType;
    }
    


//verifica se tutti gli input sono stati compilati correttamente in tutte le sezioni con lo stesso data-type
function checkInputsInSections() {

    const dataType = FoundDataType();

    const sections = document.querySelectorAll(`.form-step[data-type="${dataType}"]`);

    let totalInputs = 0;
    let filledInputs = 0;
    let allModalsActive = true;




    sections.forEach(function(section) {
        let inputsInSection = section.querySelectorAll('input[required]');
        let modalsInSection = section.querySelectorAll('.modal');

        totalInputs += inputsInSection.length;
//decommentare totalInputs per controllo input
       

        inputsInSection.forEach(function(input) {
            if (input.value.trim() !== '') {
                filledInputs++;
            }
        });

        modalsInSection.forEach(function(modal) {
            if (!modal.classList.contains('active-modal')) {
                allModalsActive = false;
            }
        });
    });


  if ( scelta === 'a4' && filledInputs === totalInputs && allModalsActive) {
    btnAnteprima.forEach(btn => { btn.removeAttribute('disabled'); });
    } 
    

}

    

function addEventListenersToInputs() {
    let inputs = document.querySelectorAll('.form-step input');
    inputs.forEach(function(input) {
        input.addEventListener('change', checkInputsInSections);
    });
}

addEventListenersToInputs();


const tailTexts = document.querySelectorAll('.tail-text');

tailTexts.forEach(function(tailText) {
    tailText.addEventListener('click', function() {

        this.classList.add('open');
        
        tailTexts.forEach(function(otherTailText) {
            if (otherTailText !== tailText) {
                otherTailText.classList.remove('open');

                otherTailText.parentNode.classList.remove('open');
            }
        });

        this.parentNode.classList.add('open');

        let contSee = document.querySelector('.form-step[style="display: block;"]');

        togglePage(this.id, contSee, "block");
    });
});

const btns = document.querySelectorAll('.btn-step-tail');

    btns.forEach((btn, index) => {
        btn.style.zIndex = 20 - index; 

    });




export function togglePage(sectionId, currentSection,state) {


    if (currentSection) {
        currentSection.style.display = 'none';
        const secClass = Array.from(currentSection.classList).find(className => className.startsWith('sec'));

        const buttonId = secClass;
        const button = document.getElementById(buttonId);

        if(button) {
            validateInputsAndModals(currentSection, button); 
        }

    }

    // Mostra la sezione target
    const targetSection = document.querySelector(`.${sectionId}`);
    if (targetSection) {
        targetSection.style.display = state;
    }

}

document.addEventListener('DOMContentLoaded', (event) => {
    let textAreas = document.querySelectorAll('.descrizione_start');

    // Aggiungi un listener per l'evento 'input' su ciascun textarea
    textAreas.forEach((textArea) => {
        textArea.addEventListener('input', (event) => {
            // Aggiorna il testo visibile nel textarea
            textArea.textContent = event.target.value;
            console.log("description=", textArea.textContent);

            // Aggiorna anche il valore del textarea
            textArea.value = event.target.value;
        });
    });
});


export function validateInputsAndModals(currentSection, button) {

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
    
    const padreButton = button.closest('.btn-step-tail');

        const buttonCircle = padreButton.querySelector(".circle-tail"); 

            if (!allInputsValid || !allModalsActive) {
                buttonCircle.style.backgroundColor = '#FF8C00';
            } else {
                buttonCircle.style.backgroundColor = '#7cfc00';
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



function display(subject, mode) {
        subject.style.display = mode;
    }
    
    function pagesButtonBlock() {

        const tailWeb = document.querySelector(".tail-cont-web");
        const tailA4 = document.querySelector(".tail-cont-a4");
    
        if (scelta === "a4") {
            display(tailA4, tailA4.style.display === "none" ? "flex" : "none");
            tailWeb.style.display = "none";
        } else if (scelta === "volantino_digitale") {
            display(tailWeb, tailWeb.style.display === "none" ? "flex" : "none");
            tailA4.style.display = "none";
        } else {
            tailWeb.style.display = "none";
            tailA4.style.display = "none";
        }

    }


    

    export function navigaSezione(direzione, pushedPreview) {
        
        const tutteLeSezioni = Array.from(document.querySelectorAll('.form-step'));
        const sezioneAttualmenteVisibile = tutteLeSezioni.find(section => section.getBoundingClientRect().height > 0);
    
        const sezioniFiltrate = tutteLeSezioni.filter(section => section.dataset.type === currentDataType[0]);
        let indiceAttuale = sezioniFiltrate.indexOf(sezioneAttualmenteVisibile);
        let prossimoIndice = (indiceAttuale + 1) % sezioniFiltrate.length;
    
        let previewStep = sezioniFiltrate[sezioniFiltrate.length - 1];
    
        if (direzione === "avanti") {
            if (pushedPreview && previewStep) {
                // Memorizza la sezione attualmente visibile prima di nasconderla
                if (!sezioniPassate.includes(sezioneAttualmenteVisibile)) {
                    sezioniPassate.push(sezioneAttualmenteVisibile);
                }
    
                // Nasconde la sezione attualmente visibile
                sezioneAttualmenteVisibile.style.display = 'none';
                // Mostra la sezione di anteprima
                previewStep.style.display = "block";
                pagesButtonBlock();
                return; // Esci dalla funzione poiché l'anteprima è stata mostrata
            }
    
            if (sezioniFiltrate.length === 0) {
                console.log("Nessuna sezione è stata trovata per il data-type corrente.");
                return;
            }
    
            if (prossimoIndice < indiceAttuale) {
                console.log("Non ci sono altre sezioni disponibili con lo stesso data-type in avanti.");
                return;
            } else {
                // Memorizza la sezione attualmente visibile prima di nasconderla
                if (!sezioniPassate.includes(sezioneAttualmenteVisibile)) {
                    sezioniPassate.push(sezioneAttualmenteVisibile);
                }
                // Nasconde la sezione attualmente visibile
                sezioneAttualmenteVisibile.style.display = 'none';
            }
    
            if (sezioniFiltrate[prossimoIndice]) {
                sezioniFiltrate[prossimoIndice].style.display = 'block';
                if (!sezioniPassate.includes(sezioniFiltrate[prossimoIndice])) {
                    sezioniPassate.push(sezioniFiltrate[prossimoIndice]);
                }
            }
    
            pagesButtonBlock();
    
        } else if (direzione === "indietro") {

            if (indiceAttuale === 0) {
                resetAll();
                return;
            }
    
            aggiungiDataTypeToArray(sezioneAttualmenteVisibile.dataset.type);
    
            if (sezioneAttualmenteVisibile) {
                sezioneAttualmenteVisibile.style.display = 'none';
            }
    
            if (pushedPreview) {
                // Se pushedPreview è true, rimuovi l'ultima sezione aggiunta e mostra quella precedente
                const sezioneDaMostrare = sezioniPassate.pop();
                if (sezioneDaMostrare) {
                    sezioneDaMostrare.style.display = 'block';
                    console.log("Ecco la sezione da mostrare", sezioneDaMostrare);
                }
                pagesButtonBlock();
                return;

            } else {
                // Se pushedPreview non è true, mostra l'ultima sezione passata
                if (sezioniPassate.length > 1) {

                    // sezioniPassate.pop(); // Rimuovi l'ultima sezione passata che è già stata nascosta
                    const sezioneDaMostrare = sezioniPassate[sezioniPassate.length - 1];
                    sezioneDaMostrare.style.display = 'block';

                } else {
                    const sezioneIniziale = tutteLeSezioni.find(section => section.dataset.type === 'start');
                    
                    if (sezioneIniziale) {
                        sezioneIniziale.style.display = 'block';
                    }
                    currentDataType = ['start'];
                    sezioniPassate = [sezioneIniziale];
                    console.log("Sezione start");
                }
            }
    
            pagesButtonBlock();
        }
    }
    


    function resetAll() {
        
        btnVolantinoA4.classList.remove("active");
        btnVolantinoWeb.classList.remove("active");
    
       
        sezioniPassate = [];
        currentDataType = [];
        jsonData = {};

        document.querySelector(".tail-cont-web").style.display = "none";
        document.querySelector(".tail-cont-a4").style.display = "none";
    
        
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
export function addEventListenerMouseLeave() {
    
    let inputRows = document.querySelectorAll('.product-name-cont');
   
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

    const filePath = '../file comuni/archivio generale.csv';

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



export function alertFunction(message, type) {

    const alertDiv = document.createElement('div');

    alertDiv.classList.add('alertDiv');
    
    // Aggiunta delle classi in base al tipo di avviso
    switch (type) {
        case 'success':
            alertDiv.classList.add('alert-success');
            break;
        case 'error':
            alertDiv.classList.add('alert-danger');
            break;
        default:
            alertDiv.classList.add('alert-primary');
    }


    // Creazione del pulsante di chiusura
    const closeButton = document.createElement('button');

    closeButton.type = 'button';

    closeButton.classList.add('closeAlertBtn');
    closeButton.innerHTML = 'Chiudi'; 

    closeButton.addEventListener('click', function() {

        document.body.removeChild(alertDiv);
    });

    // Creazione del contenuto del messaggio di avviso
    const messageElement = document.createElement('span');
    messageElement.classList.add('AlertSpan');
    messageElement.textContent = message;

        alertDiv.appendChild(messageElement);

        alertDiv.appendChild(closeButton);
  
        document.body.appendChild(alertDiv);


    // setTimeout(function() {
    //     document.body.removeChild(alertDiv);
    // }, 7000);
    
}


export async function uploadImg () {

    let inputImg = document.querySelectorAll('.img-input');

    inputImg.forEach( (input) => {

        input.addEventListener('change', function() {
            
           const file = this.files[0];

           const parentContImg = input.closest(".cont-scelta-img");
           const imgElement = parentContImg.querySelector(".img");
   
       if (file) {
           const formData = new FormData();
           formData.append('image', file);
   
           fetch('upload_image.php', {
               method: 'POST',
               body: formData
           })
           .then(response => response.json())
           .then(data => {
               if (data.success) {

                   const imageUrl = data.url;
                   imgElement.src = imageUrl
                   console.log(`Data ritorno: ${imageUrl}`)
                   
               } else {
                   alert('Errore durante il caricamento dell\'immagine.');
               }
           })
           .catch(error => {
               console.error('Errore:', error);
               alert('Errore durante il caricamento dell\'immagine.');
           });
       }
   });
        })

}
document.addEventListener('DOMContentLoaded', uploadImg);










//logica login momentanea 

const loginCont = document.querySelectorAll(".login");
const accessBtn = document.querySelector(".access-btn");

const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginCont.forEach( (login) => {
   display(login, "flex");
})


  // Aggiungere evento click al pulsante di accesso
  accessBtn.addEventListener("click", function () {

    const username = userNameInput.value;
    const password = passwordInput.value;

    // Creare oggetto FormData
    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    fetch('./access.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            alertFunction("Errore con il server contattare il rivenditore se persiste", "error");
            throw new Error('Errore con il server');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log("Credenziali corrette");
            displayLoginLogout("login");
            
        } else {
            console.log("Credenziali scorrette");
            alertFunction("Credenziali scorrette", "error")
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alertFunction("Errore con il server contattare il rivenditore se persiste", "error");
    });
});

    // // Aggiungere evento click al pulsante di logout
    // logoutBtn.addEventListener("click", function () {
    //     displayLoginLogout("logout");
    // });

    const btnLogout = document.querySelector('.info-sec-user span')
    const cont_user_info = document.querySelector('.cont-user-info')

    btnLogout.addEventListener("click", () => {
        displayLoginLogout("logout");
        cont_user_info.style.display = "none"
    })


    function displayLoginLogout(action) {

        const navbarItems = document.querySelectorAll('.cont-navbar-item');
        const contUser = document.querySelector('.cont-user');
        const contPage1 = document.querySelector('.page1');
        const contLogin = document.querySelector('.card-login');
        const contPage6Login = document.querySelector('.page6');
    
        if (action === "login") {
   
            navbarItems.forEach(item => {
                display(item, item.classList.contains('login') ? "none" : "flex");
            });
    
            display(contUser, "flex");
            display(contPage1, "flex");
            
            display(contLogin, "none");
            display(contPage6Login, "none");

        } else if (action === "logout") {

            navbarItems.forEach(item => {
                display(item, item.classList.contains('login') ? "flex" : "none");
            });
    
            display(contUser, "none");
            display(contPage1, "none");
            display(contLogin, "flex");
            display(contPage6Login, "flex");

        } else {
            console.error("Azione non supportata:", action);
        }
    }
    