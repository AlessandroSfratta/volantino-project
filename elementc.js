
import { jsonData } from './app.js';


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
    
        // Itera attraverso gli elementi del JSON
        for (const [key, value] of Object.entries(prodottiJSON)) {
        
            const elemento = new ElementoHTML(value);
            const elementoHTML = await elemento.getHTML();
    
            // Rendi visibile l'iframe solo se ci sono prodotti per questo reparto
            let iframe = `.pagina_${value.Pagina}`;
            let iframeClass = `${iframe} iframe`;
    
            // Conta il numero di prodotti per questa categoria
            const count = Object.values(prodottiJSON).filter(prodotto => prodotto.Pagina === value.Pagina).length;
    
    
for (let i = 1; i <= count; i++) {

            let currentIframeClass = `${iframeClass}:nth-of-type(${i})`;

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
                
                    // Controlla se l'iframe corrente ha ancora spazio

                    currentIframe.classList.remove("none")
                    currentIframe.classList.add("block")

                    if (elementsInserted[currentIframeClass] < maxElementsPerPage) {
                    htmlContentFrames[currentIframeClass] += elementoHTML;
                        elementsInserted[currentIframeClass]++;
                        console.log(`Inserito elemento in ${currentIframeClass}, totale elementi: ${elementsInserted[currentIframeClass]}`);
                    }

                    console.log(`Spazio rimanente per ${currentIframeClass}: ${elementsInserted[currentIframeClass]} / ${maxElementsPerPage}`);

                } else {

                    
                const lastFrame = document.querySelector(`${iframeClass}:nth-of-type(${i - 1})`);
                   
                    let clonedIframe = lastFrame.cloneNode(true);
    

                    // Inserisci il clone come ultimo figlio del container iframe
                    lastFrame.parentNode.appendChild(clonedIframe);

                clonedIframe.addEventListener("load", function () {

                const clonedDocument = clonedIframe.contentDocument || clonedIframe.contentWindow.document;

                    const containerDocumentIframeCloned = clonedDocument.querySelector('.pagina_container');
    
                    console.log(`Ecco il container clonato: ${clonedDocument}`);
                    
                    maxElementsPerPage = parseInt(clonedIframe.getAttribute('data-max-elements'));

                    containerDocumentIframeCloned.innerHTML = " "; 
    
        
                        htmlContentFrames[currentIframeClass] = elementoHTML;
                        elementsInserted[currentIframeClass] = 1; // Inizializza elementsInserted per il nuovo iframe
        
                        clonedIframe.classList.remove('none');
                        clonedIframe.classList.add('block');
    
                        console.log("Creato nuovo iframe con maxElementsPerPage:", maxElementsPerPage);
                     console.log(`Inserito elemento in ${currentIframeClass}, totale elementi: ${elementsInserted[currentIframeClass]}`);


                })

              
                }
            }
        }

    
        for (let currentIframeClass in htmlContentFrames) {
            const iframe = document.querySelector(currentIframeClass);
            if (iframe) {
                const iframeDocument = iframe.contentWindow.document;
                const contentContainer = iframeDocument.querySelector('.pagina_container');
    
                if (contentContainer) {
                    contentContainer.innerHTML = htmlContentFrames[currentIframeClass];
                } else {
                    console.error(`Contenitore della pagina non trovato nell'iframe con classe ${currentIframeClass}`);
                }
            } else {
                console.error(`Frame non trovato con la classe ${currentIframeClass}`);
            }
        }
    } catch (error) {
        console.error('Errore nel caricamento dei dati JSON:', error);
    }
    
    
    
}














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



const anteprimaPdf = document.querySelectorAll(".anteprima");
anteprimaPdf.forEach(btnAnteprima => {
    btnAnteprima.addEventListener("click", () => { generaElementi(btnAnteprima) });
})




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
