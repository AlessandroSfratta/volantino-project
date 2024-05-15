
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
    
        // Itera elementi del JSON
    for (const [key, value] of Object.entries(prodottiJSON)) {
            
        const elemento = new ElementoHTML(value);
            const elementoHTML = await elemento.getHTML();
    
            // conta il numero di prodotti per questa categoria
            const count = Object.values(prodottiJSON).filter(prodotto => prodotto.Pagina === value.Pagina).length;
    
            // rendi visibile l'iframe solo se ci sono prodotti per questo reparto
            let iframe = `.pagina_${value.Pagina}`;
            let iframeClass = `${iframe} iframe`;

            let maxElementsPerPage = parseInt(document.querySelector(iframeClass).getAttribute('data-max-elements'));
    
            console.log("Numero massimo elemento",maxElementsPerPage);
    
            if (count > 0) {
                document.querySelector(iframeClass).classList.remove('none');
                document.querySelector(iframeClass).classList.add('block');
            } else {
                console.error(`Frame non trovato con la classe ${iframeClass}`);
                continue;
            }
    
            if (!htmlContentFrames[iframeClass]) {
                htmlContentFrames[iframeClass] = '';
            }

         console.log("Elementi template primo frame:", document.querySelectorAll(`${iframeClass} .templatearticolo`).length < maxElementsPerPage ); 

         //risolvere errore : ASSEGNA TUTTO AL PRIMO IFRAME
    
            // Se il numero di elementi inseriti nel primo iframe è inferiore al numero massimo consentito, inserisci l'elemento nel primo iframe
            if (document.querySelectorAll(`${iframeClass} .templatearticolo`).length < maxElementsPerPage) {
               
                htmlContentFrames[iframeClass] += elementoHTML;


            } else if (document.querySelectorAll(`${iframeClass}:nth-of-type(2) .templatearticolo`).length < maxElementsPerPage) {
                htmlContentFrames[`${iframeClass}:nth-of-type(2)`] += elementoHTML;
            } else {
            
            let i = 3;

            if (!document.querySelector(`${iframeClass}:nth-of-type(${i})`) 
                || document.querySelectorAll(`${iframeClass}:nth-of-type(${i}) .templatearticolo`).length < maxElementsPerPage) {

                const secondFrame = document.querySelector(`${iframeClass}:nth-of-type(2)`);

                let clonedIframe = secondFrame.cloneNode(true);
                maxElementsPerPage = parseInt(clonedIframe.getAttribute('data-max-elements'));
                //correggere controllare elemento creato e assegnare il suo maxElementsPerPage
                    // per poi controllare se i è pieno 

                document.querySelector(iframe).appendChild(clonedIframe);


                clonedIframe.classList.remove('none');
                clonedIframe.classList.add('block');
                    
                    
                htmlContentFrames[`${iframeClass}:nth-of-type(${i})`] = '';
                   
                           
                console.log("Numero massimo frame clonato:",maxElementsPerPage);
                          
                    const clonedIframeClass = `${iframeClass}:nth-of-type(${i})`;
                           
                    if (!htmlContentFrames[clonedIframeClass]) {
                                htmlContentFrames[clonedIframeClass] = '';
                            }
                            
                            htmlContentFrames[clonedIframeClass] += elementoHTML;

                                clonedIframe.classList.remove('none');
                                clonedIframe.classList.add('block');
  
                                i++;   
                    }

            }
        
    }
          

        // contenuto HTML nei rispettivi frame
 for (let iframeClass in htmlContentFrames) {
            const iframe = document.querySelector(iframeClass);
            if (iframe) {

                const iframeDocument = iframe.contentWindow.document;
                const contentContainer = iframeDocument.querySelector('.pagina_container');
                if (contentContainer) {
                    contentContainer.innerHTML = htmlContentFrames[iframeClass];
                   
                } else {
                    console.error(`Contenitore della pagina non trovato nell'iframe con classe ${iframeClass}`);
                }
            } else {
                console.error(`Frame non trovato con la classe ${iframeClass}`);
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
