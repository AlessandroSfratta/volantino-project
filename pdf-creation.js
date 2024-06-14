
import { jsonData, getScelta, alertFunction, navigaSezione} from './form-wizard.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}


function progressBar(progress) {
    const progressBarCont = document.getElementById('cont_progress_bar');
    progressBarCont.style.display = 'flex';

    const loadingBar = document.getElementById('loading');

        loadingBar.style.width = progress + '%';

        if (progress >= 100) {
            setTimeout(() => {
                progressBarCont.style.display = 'none';
            }, 500);
            
    };
}



async function generaElementi(updateProgress) {
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
                <p class="np">${this.nomeProdotto}</p>
                <div class="imgprodotto"><img src="${imageUrl}" alt="${this.nomeProdotto}"></div>
                <div class="info">
                    <p class="descrizione">${this.descrizione}</p>
                    <div class="contenitoreprezzo">
                        <p class="prezzoa">${this.euro}</p>
                        <p class="prezzob">,${this.centesimi} <span>€</span></p>
                    </div>
                </div>
                <div class="ombra"> </div>
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
       
        const totalProducts = Object.keys(prodottiJSON).length;

        let loadedProducts = 0;

    
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
                        InputDescrizione.forEach( (textArea) => {

                            if (textArea.textContent.trim() !== '') {
                                currentDescription.innerHTML = textArea.textContent;
                                console.log("description=", textArea.textContent);
                            } else {
                                console.log("Il textarea è vuoto nel DOM");
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
            
            loadedProducts++;
        if(totalProducts >= 1) {
                let load = (loadedProducts / totalProducts) * 100;
                progressBar(load);
               console.log("Ecco il load:", load);
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
                        alertFunction(`Contenitore della pagina non trovato nell\'iframe con classe ${currentIframeClass}`, 'error');
                    }
            
                // });
            // });
        }



            } catch (error) {
                console.error('Errore nel caricamento dei dati JSON:', error);
                alertFunction(`'Errore nel caricamento dei dati JSON:${error}`, 'error');

            }

            
        }



    // function showPreview(event) {
    //         // Trova il form-step più vicino al bottone cliccato
    //         const formStep = event.target.closest('.form-step');
    //         const tutteLeSezioni = Array.from(document.querySelectorAll('.form-step'));
    //         const dataType = formStep.dataset.type;
    //         const sezioniFiltrate = tutteLeSezioni.filter(section => section.dataset.type === dataType);

    //         // Ottieni l'indice della sezione form-step
    //         const indiceFormStep = tutteLeSezioni.indexOf(formStep);

    //         sezioniPassate[indiceFormStep];
    //         console.log("Ecco l'indice:", sezioniPassate[indiceFormStep]);
            
            
        
    //     const ultimaSezione = sezioniFiltrate[sezioniFiltrate.length - 1];
    //             ultimaSezione.style.display = "block"
    //             indiceFormStep.style.display = "none"

    //         // Stampa l'indice e il data-type
    //         console.log("Indice form-step:", indiceFormStep);
    //         console.log("Data-type:", dataType);
        
    //     }


    document.querySelectorAll(".anteprima").forEach(btnAnteprima => {
        btnAnteprima.addEventListener("click", async (event) => {

if (Object.keys(jsonData).length > 0) {
            progressBar(0);
                await generaElementi();
             const btnPreview = true;

                navigaSezione("avanti", btnPreview);
            } else {
                alertFunction("Seleziona prima dei prodotti!", "error");
            }
    
        });
    });








const options = {
    filename: 'PDF_Volantino.pdf',
    margin: 0,
    border: 0,
    image: { type: 'png', quality: 1 },
    html2canvas:  { 
        dpi: 1200,
        scale: 2,
        useCORS: true,  
        logging: true,
        letterRendering: true,
        backgroundColor: null 

     },

     jsPDF: {
        unit: 'mm', 
        format: [216, 303], 
        orientation: 'portrait'
    },
   
    avoidPageSplit: true, 
    pagebreak: { mode: 'always' },
    enableLinks: true,
    background: false,
    autoPaging: true

};




document.querySelectorAll(".btn-confirm").forEach(button => { button.addEventListener("click", convertiInPDF); });



function convertiInPDF() {

        
        const iframes = document.querySelectorAll('iframe.block');
    
        
        const combinedContent = document.createElement('div');


        combinedContent.style.display = 'flex';
        combinedContent.style.flexDirection = 'column';
        combinedContent.style.flexDirection = 'column';
       
        combinedContent.style.alignItems = 'center';
        combinedContent.style.justifyContent = 'center';
        combinedContent.style.margin = '0';
        combinedContent.style.padding = '0'; 
        combinedContent.style.border = '0'; 
        combinedContent.style.boxSizing = 'border-box'; 
       
     

        const clonePromises = [];

        let clonedIframesCount = 0;
    
        
        iframes.forEach(iframe => {
            const clonePromise = new Promise((resolve, reject) => {
               
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    const cloneDoc = iframeDoc.documentElement.cloneNode(true);
    
                    const styleLinks = cloneDoc.querySelectorAll('link[rel="stylesheet"]');
                    styleLinks.forEach(link => {
                        link.href = './frame-pdf/stylePdfs.css'; 
                    });

                    clonedIframesCount++;
    
                    // Modifica i link immagini
                    const backgroundStyles = cloneDoc.querySelectorAll('.sfondo');
                    backgroundStyles.forEach(style => {
                        const currentBackground = style.style.backgroundImage;
                        const newBackground = currentBackground.replace(/\.\.\//g, './frame-pdf/');
                        style.style.backgroundImage = newBackground;
                    });
                    

                    // Impostazioni di stile per il cloneDoc
                  
                    cloneDoc.style.display = "flex";
                    cloneDoc.style.justifyContent = "center";
                    cloneDoc.style.alignItems = "center";
                    cloneDoc.style.flexDirection = 'column';
                    cloneDoc.style.border = 0;
                    cloneDoc.style.margin = 0;
                    cloneDoc.style.padding = 0;
                    cloneDoc.style.position = "relative";
                    cloneDoc.style.boxSizing = 'border-box';
                    cloneDoc.style.pageBreakAfter = "always"; 
                    cloneDoc.style.marginBottom = "0.5px";

                    if (getScelta() === "a4" || getScelta() === "volantino_digitale") {
                        cloneDoc.style.width = "216mm";
                        cloneDoc.style.height = "303mm";
                    } else if (getScelta() === "cartellini") {
                        cloneDoc.style.width = "156mm";
                        cloneDoc.style.height = "106mm";
                    }

                   
    
                    
                    combinedContent.appendChild(cloneDoc);

                    resolve();
    
                } catch (error) {
                    console.error('Errore nell\'accesso al contenuto dell\'iframe:', error);
                    reject(error); 
                }
            });
    
            clonePromises.push(clonePromise);
        });

        let conf_download_pdf = document.getElementById('conf_download').checked;

        document.getElementById('conf_download').addEventListener('change', function() {
            conf_download_pdf = this.checked;
            console.log('bottonePremuto:', conf_download_pdf); 
        });

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }



 Promise.all(clonePromises)
 .then(() => {
     const formData = new FormData();

     const today = new Date();
     const formattedDate = formatDate(today);

     if (getScelta() === "volantino_digitale") {

        const volantinoDigitaleOption = {...options, filename:`Volantino_digitale_${formattedDate}.pdf`}
        
         html2pdf().from(combinedContent).set(volantinoDigitaleOption).outputPdf('blob')
             
         .then(pdfBlob => {
                 formData.append('pdf_content', pdfBlob, 'Volantino_digitale.pdf');
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

            html2pdf().from(combinedContent).set(volantinoDigitaleOption).save()
            .then(() => {
                alertFunction("Congratulazioni! Hai caricato il volantino e salvato nella tua pagina personale.", 'success');
                window.open("https://volantino.biz/volantino-project/mm.html", "_blank");
            })

            .catch((error) => {
              alertFunction('Errore durante il caricamento del PDF:', 'error');
              
            });
            
        } else {
             alertFunction("Congratulazioni! Hai caricato il volantino sulla tua pagina personale.", 'success');
             
             setTimeout(()=> {
                window.open("https://volantino.biz/volantino-project/mm.html", "_blank");
            }, 4000)
         }

     } else if (getScelta() === "a4") {

        const volantinoA4Options = {...options, filename:`Volantino_A4_${formattedDate}.pdf`}
        
        html2pdf().from(combinedContent).set(volantinoA4Options).save()
        
    .then(() => {

        
      alertFunction("Congratulazioni! I prodotti sono stati caricati correttamente.", 'success');

    }).catch((error) => {
          alertFunction('Errore durante il caricamento del PDF:', 'error');
          console.log(`Errore durante il caricamento del pdf ${error}`)
        });
     } else if (getScelta() === "cartellini") {

        const optionsCartellini = {
            // filename: 'Cartelli.pdf',
            margin: 0,
            border: 0,
            image: { type: 'png', quality: 1 },
            html2canvas:  { 
                dpi: 1200,
                scale: 1,
                useCORS: true,  
                logging: true,
                letterRendering: true,
                backgroundColor: null 
        
             },
        
             jsPDF: {
                unit: 'mm', 
                format: [156, 106], 
                orientation: 'landscape'
            },
             
             avoidPageSplit: true,
             pagebreak: { mode: 'always' },
            enableLinks: true,
            background: false,
            autoPaging: true
        
        };

        const cartelliniOptions = {...optionsCartellini, filename:`Cartellini_${formattedDate}.pdf`}
        
        html2pdf().from(combinedContent).set(cartelliniOptions).save()
         
     }


         const progress = (clonedIframesCount / clonePromises.length) * 100;
         progressBar(progress);
 })

 .catch(error => {
     console.error('Errore durante la clonazione degli iframe:', error);
     alertFunction('Errore durante la clonazione degli iframe: ' + error, 'error');
 });

}






