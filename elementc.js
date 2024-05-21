
import { jsonData, getScelta } from './app.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}

let content;



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

        const InputDescrizione = document.querySelectorAll(".descrizione");
        
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

                    const CurrentValidityStart = CurrentDocument.querySelector('.validità-da')
                    const CurrentValidityEnd = CurrentDocument.querySelector('.validità-a')

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
    margin: 1,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
        dpi: 192,
        scale: 2,
        useCORS: true,  
        letterRendering: true,
     },

     jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        height: 1000
    }, 

    // pagebreak: { mode: ['css', 'legacy'] },
    enableLinks: true,
    background: true,
    autoPaging: false 

};



document.querySelectorAll(".btn-confirm").forEach(button => { button.addEventListener("click", convertiInPDF); });



function convertiInPDF() {

    // funzione da aggiustare per diversi pdf prendere info da scelta 

    console.log("Valore iniziale di scelta:", getScelta());

    
    html2pdf().from(content).set(options).save();

    html2pdf().from(content).set(options).outputPdf('blob').then(pdfBlob => {
        
        const formData = new FormData();
        formData.append('pdf_content', pdfBlob, 'my-document.pdf');

        fetch('save-pdf.php', {
            method: 'POST',
            body: formData
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

        });
    });
    
}
