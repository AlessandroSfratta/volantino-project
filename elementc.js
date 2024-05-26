
import { jsonData, getScelta, alertFunction } from './app.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}







async function generaElementi() {
    class ElementoHTML {
        constructor(prodotto) {
            this.imageData = prodotto.Immagine;
            this.nomeProdotto = prodotto.nomeProdotto;
            this.descrizione = prodotto.Descrizione;
            this.euro = prodotto.Euro;
            this.centesimi = prodotto.Centesimi;
        }

        async getHTML() {
            const blob = await convertToDataURL(this.imageData);
            const imageUrl = URL.createObjectURL(blob);
            return `
                <div class="templatearticolo">
                    <div class="np">${this.nomeProdotto}</div>
                    <div class="imgprodotto"><img src="${imageUrl}" alt="${this.nomeProdotto}"></div>
                    <div class="info">
                        <div class="descrizione">${this.descrizione}</div>
                        <div class="contenitoreprezzo">
                            <div class="prezzoa">${this.euro}</div>
                            <div class="prezzob">${this.centesimi}</div>
                        </div>
                    </div>
                </div>`;
        }
    }

    try {

        const prodottiJSON = jsonData;
        let htmlContentFrames = {};
        let elementsInserted = {};

        const InputDescrizione = document.querySelectorAll(".descrizione_start");
        
        const InputValidityStart = document.querySelectorAll(".inputValidityStart"); 
        const InputValidityEnd = document.querySelectorAll(".inputValidityEnd");
       

    
        for (const [key, value] of Object.entries(prodottiJSON)) {
           
            const elemento = new ElementoHTML(value);
            const elementoHTML = await elemento.getHTML();
    
            let iframeClass = `.pagina_${value.Pagina} iframe`;
           
            let i = 1;
            let inserted = false;
    
        
        while (!inserted) {

                let currentIframeClass = `${iframeClass}:nth-of-type(${i})`;
    
                console.log("Ecco i:", i);
    
                if (!elementsInserted[currentIframeClass]) {
                    elementsInserted[currentIframeClass] = 0;
                }
    
                if (!htmlContentFrames[currentIframeClass]) {
                    htmlContentFrames[currentIframeClass] = '';
                }

    
                let currentIframe = document.querySelector(currentIframeClass);
             
                let maxElementsPerPage = currentIframe ? parseInt(currentIframe.getAttribute('data-max-elements')) : 0;
    
                if (currentIframe) {
                    console.log("Numero massimo elemento per", currentIframeClass, ":", maxElementsPerPage);
    

                    const CurrentDocument = currentIframe.contentDocument || currentIframe.contentWindow.document;

                    const CurrentValidityStart = CurrentDocument.querySelector('.validità-da');
                    const CurrentValidityEnd = CurrentDocument.querySelector('.validità-a');

                    const currentDescription = CurrentDocument.querySelector('.descrizione_Volantino');


                    if(currentDescription) {
                        console.log("Current description esiste");
                        InputDescrizione.forEach( (input) => {

                            if(input.value) {
                                currentDescription.textContent = input.value
                                console.log("description=", input.value);
                            }
             
                        })
                        console.log("fine ciclo description");
                    }
                    
      if(CurrentValidityStart && CurrentValidityEnd) {

                        const ChangeFormateDate = function(date) {
                          
                            if (date instanceof Date) {
                                return date.toLocaleDateString("it-IT");
                            }
                            return null;
                        };


                     const iterOnStart = function () {
                        for (let input of InputValidityStart) {
                    if(input.value) { return  ChangeFormateDate(input.valueAsDate) } }
                return null;

                     }

                     const iterOnEnd = function () {
                        for (let input of InputValidityEnd) {
                    if(input.value) { return ChangeFormateDate(input.valueAsDate) } }
                return null;

                     }

                        CurrentValidityStart.innerHTML = iterOnStart();
                        CurrentValidityEnd.innerHTML =   iterOnEnd();

                    }

                    // currentIframe.classList.remove("none");
                    // currentIframe.classList.add("block");
    
                    if (elementsInserted[currentIframeClass] < maxElementsPerPage) {
                        htmlContentFrames[currentIframeClass] += elementoHTML;
                        elementsInserted[currentIframeClass]++;
                        
                        console.log(`Inserito elemento in ${currentIframeClass}, totale elementi: ${elementsInserted[currentIframeClass]}`);
                        inserted = true;
                        
                    } else {
                        i++;
                    }

                } else {

                    const lastFrame = document.querySelector(`${iframeClass}:nth-of-type(${i - 1})`);
                    let clonedIframe = lastFrame.cloneNode(true);
    
                    lastFrame.parentNode.appendChild(clonedIframe);

                    await new Promise((resolve) => { 
    
                    clonedIframe.addEventListener("load", function () {
                        
                        const clonedDocument = clonedIframe.contentDocument || clonedIframe.contentWindow.document;
                       
                        const containerDocumentIframeCloned = clonedDocument.querySelector('.pagina_container');
    
                        maxElementsPerPage = parseInt(clonedIframe.getAttribute('data-max-elements'));
    
                        containerDocumentIframeCloned.innerHTML = "";

                        console.log(`Ecco il container clonato: ${containerDocumentIframeCloned}`);

                            
                        htmlContentFrames[currentIframeClass] += elementoHTML;
                        elementsInserted[currentIframeClass]++;
        
                            console.log(`Inserito elemento in ${currentIframeClass}, totale elementi: ${elementsInserted[currentIframeClass]}`);
                  

                        console.log("Creato nuovo iframe con maxElementsPerPage:", maxElementsPerPage);
                        console.log(`Inserito elemento in ${currentIframeClass}, totale elementi: ${elementsInserted[currentIframeClass]}`);
                        
                            resolve();
                        });
                    });
                    inserted = true;
                    // continue;
                }
            }
        }
    

    
    for (const currentIframeClass of Object.keys(htmlContentFrames)) {
            const iframe = document.querySelector(currentIframeClass);
        
            // iframe.addEventListener('load', () => {
                const iframeDocument = iframe.contentWindow.document;
        
                // iframeDocument.addEventListener('DOMContentLoaded', () => {
                    const contentContainer = iframeDocument.querySelector('.pagina_container');
        
                    if (contentContainer) {
                        contentContainer.innerHTML = htmlContentFrames[currentIframeClass];
                        iframe.classList.remove('none');
                        iframe.classList.add('block');

                        
                        console.warn(`Contenitore della pagina trovato e aggiunto OK ${currentIframeClass}`);
                    } else {
                        console.error(`Contenitore della pagina non trovato nell'iframe con classe ${currentIframeClass}`);
                    }
                // });
            // });
        }
          
            } catch (error) {
                console.error('Errore nel caricamento dei dati JSON:', error);
            }

            
        }





const anteprimaPdf = document.querySelectorAll(".anteprima");
anteprimaPdf.forEach(btnAnteprima => {
    btnAnteprima.addEventListener("click", () => { generaElementi() });
})





const optionss = {
    filename: 'Test.pdf',
    margin: 1,
    image: { type: 'jpeg', quality: 0.98 },

    html2canvas:  { 
        dpi: 300,
        scale: 2, // Aumenta il valore di scale per una maggiore risoluzione
        useCORS: true, // Abilita l'uso di CORS per il caricamento delle immagini esterne 
        letterRendering: true,
     },

    jsPDF: { unit: '', format: 'letter', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css'] },
    enableLinks: true,

    background: true,
    autoPaging: true // Imposta autoPaging su false per evitare la suddivisione del contenuto su più pagine
};




const options = {
    filename: 'my-document.pdf',
    margin: 0,
    border: 0,
    image: { type: 'jpeg', quality: 1 },
    html2canvas:  { 
        dpi: 1200,
        scale: 2,
        useCORS: true,  
        letterRendering: true,
     },

     jsPDF: {
        unit: 'mm', 
        format: [216, 303], // Larghezza e altezza personalizzate
        orientation: 'portrait'
    },
     // Genera una nuova pagina per ogni iframe
    avoidPageSplit: true, // Impedisce a un iframe di essere suddiviso su più pagine
    pagebreak: { mode: 'always' },
    enableLinks: true,
    background: false,
    autoPaging: true

};



document.querySelectorAll(".btn-confirm").forEach(button => { button.addEventListener("click", convertiInPDF); });



function convertiInPDF() {

        // Seleziona tutti gli iframe con la classe 'block' nel documento
        const iframes = document.querySelectorAll('iframe.block');
    
        // Crea un contenitore per tutti i frame combinati
        const combinedContent = document.createElement('div');


        combinedContent.style.display = 'flex';
        combinedContent.style.flexDirection = 'column';
        combinedContent.style.flexDirection = 'column';
       
        combinedContent.style.alignItems = 'center';
        combinedContent.style.justifyContent = 'center';
        combinedContent.style.margin = '0'; // Rimuovi margini
        combinedContent.style.padding = '0'; // Rimuovi padding
        combinedContent.style.border = '0'; // Rimuovi padding
        combinedContent.style.boxSizing = 'border-box'; // Assicura che non ci siano aggiustamenti di dimensioni dovuti al box model
       
     

        // Array per memorizzare le promesse di clonazione degli iframe
        const clonePromises = [];
    
        // Itera attraverso ogni iframe e avvia il processo di clonazione
        iframes.forEach(iframe => {
            const clonePromise = new Promise((resolve, reject) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    // Clona il documento dell'iframe
                    const cloneDoc = iframeDoc.documentElement.cloneNode(true);
    
                    // Modifica i link nello stile all'interno dell'iframe clonato
                    const styleLinks = cloneDoc.querySelectorAll('link[rel="stylesheet"]');
                    styleLinks.forEach(link => {
                        link.href = './frame-pdf/stylePdfs.css'; // Cambia il percorso dello stile
                    });
    
                    // Modifica i link alle immagini all'interno dello stile dell'iframe clonato
                    const backgroundStyles = cloneDoc.querySelectorAll('.sfondo');
                    backgroundStyles.forEach(style => {
                        // Otteniamo il percorso attuale dello sfondo
                        const currentBackground = style.style.backgroundImage;
                        // Modifichiamo il percorso rimuovendo eventuali occorrenze di ".." e sostituendole con "/frame-pdf/"
                        const newBackground = currentBackground.replace(/\.\.\//g, './frame-pdf/');
                        // Assegniamo il nuovo percorso dello sfondo
                        style.style.backgroundImage = newBackground;
                    });
    
                    // Impostazioni di stile per il cloneDoc
                    cloneDoc.style.width = "216mm";
                    cloneDoc.style.height = "303mm";
                    cloneDoc.style.display = "flex";
                    cloneDoc.style.justifyContent = "center";
                    cloneDoc.style.alignItems = "center";
                    cloneDoc.style.flexDirection = 'column';
                    cloneDoc.style.border = 0;
                    cloneDoc.style.margin = 0;
                    cloneDoc.style.padding = 0;
                    cloneDoc.style.position = "relative";
                    cloneDoc.style.boxSizing = 'border-box'; // Assicura che non ci siano aggiustamenti di dimensioni dovuti al box model
                    cloneDoc.style.pageBreakAfter = "always"; // Forza una nuova pagina dopo questo contenitore
                    // Aggiungi un piccolo margine di mezzo pixel per evitare sovrapposizione
                    cloneDoc.style.marginBottom = "0.5px";
    
                    // Aggiungi il contenuto dell'iframe al contenitore combinato
                    combinedContent.appendChild(cloneDoc);
    
                    resolve(); // Risolve la promise una volta completato il processo di clonazione
    
                } catch (error) {
                    console.error('Errore nell\'accesso al contenuto dell\'iframe:', error);
                    reject(error); // Rigetta la promise in caso di errore
                }
            });
    
            clonePromises.push(clonePromise);
        });

        let conf_download_pdf = document.getElementById('conf_download').checked;

        document.getElementById('conf_download').addEventListener('change', function() {
            conf_download_pdf = this.checked;
            console.log('bottonePremuto:', conf_download_pdf);  // Per verificare il valore di bottonePremuto
        });



 // Impostazione iniziale della progress bar



 Promise.all(clonePromises)
 .then(() => {
     const formData = new FormData();

     if (getScelta() === "volantino_digitale") {
         html2pdf().from(combinedContent).set(options).outputPdf('blob')
             .then(pdfBlob => {
                 formData.append('pdf_content', pdfBlob, 'my-document.pdf');
                 return fetch('save-pdf.php', {
                     method: 'POST',
                     body: formData
                 });
             })
             .then(response => {
                 if (!response.ok) {
                     throw new Error('Errore durante il salvataggio del PDF: ' + response.statusText);
                 }
                 return response.text();
             })
             .then(data => {
                 console.log(data);
             })
             .catch(error => {
                 console.error('Errore durante il salvataggio del PDF:', error);
                 alertFunction('Errore durante il salvataggio del PDF: ' + error, 'error');
             });

         if (conf_download_pdf) {
             progressBar(78);
             alertFunction("Congratulazioni! Hai caricato il volantino e salvato nella tua pagina personale.", 'success');
             html2pdf().from(combinedContent).set(options).save();
             
             setTimeout(()=> {
                window.location.href = "https://volantino.biz/volantino-project/mm.html"

             }, 4000)

         } else {
             progressBar(80);
             alertFunction("Congratulazioni! Hai caricato il volantino sulla tua pagina personale.", 'success');
             setTimeout(()=> {
                window.location.href = "https://volantino.biz/volantino-project/mm.html"

             }, 4000)
         }

     } else if (getScelta() === "a4") {
         html2pdf().from(combinedContent).set(options).save();
         progressBar(90);
         alertFunction("Congratulazioni! I prodotti sono stati caricati correttamente.", 'success');
         window.location.reload(true)
     }
 })
 .catch(error => {
     console.error('Errore durante la clonazione degli iframe:', error);
     alertFunction('Errore durante la clonazione degli iframe: ' + error, 'error');
 });

}


    function progressBar(progress) {
         
        const progressBarCont = document.getElementById('cont_progress_bar');

        progressBarCont.style.display = 'flex';
        
        const loadingBar = document.getElementById('loading');
        loadingBar.style.width = progress + '%';
    

        const interval = setInterval(() => {
            progress += 1; 
            loadingBar.style.width = progress + '%'; 
    
            if (progress >= 100) {
                progressBarCont.style.display = 'none';
                clearInterval(interval);
            }
        }, 130); 

    }
    



