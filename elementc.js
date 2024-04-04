
import { jsonData } from './app.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}


let content;



async function generaElementi() {
    try {
        const prodottiJSON = jsonData;


   // Seleziona gli iframe
   const firstPageA4 = document.querySelector('.pagina_1_a4 iframe');
   const firstPageWeb = document.querySelector('.pagina_1_web iframe');

   // Accesso ai documenti all'interno degli iframe
   const iframeDocumentA4 = firstPageA4.contentWindow.document;
   const iframeDocumentWeb = firstPageWeb.contentWindow.document;

   // Seleziona gli span con le classi "validità-da" e "validità-a" all'interno dei documenti iframe
   const spanValiditaDa_A4 = iframeDocumentA4.querySelector('.pagina1_a4 .validità-da');
   const spanValiditaA_A4 = iframeDocumentA4.querySelector('.pagina1_a4 .validità-a');

   const spanValiditaDa_Web = iframeDocumentWeb.querySelector('.pagina1_web .validità-da');
   const spanValiditaA_Web = iframeDocumentWeb.querySelector('.pagina1_web .validità-a');

   // Preleva i valori degli input
   const inputDataInizioA4 = document.querySelector('#inizio-a4');
   const inputDataFineA4 = document.querySelector('#fine-a4');

   const inputDataInizioWeb = document.querySelector('#inizio-web');
   const inputDataFineWeb = document.querySelector('#fine-web');


   function convertDateFormat(inputDate) {
    const parts = inputDate.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];

}


        // Inizializza un oggetto per tenere traccia del contenuto HTML per ciascun frame
        const htmlContentFrames = {};

        // Itera attraverso gli elementi del JSON
        for (const [key, value] of Object.entries(prodottiJSON)) {
            const imageData = await convertToDataURL(value.Immagine);
            const imageUrl = URL.createObjectURL(imageData);

            // Costruisci l'HTML per l'elemento
            const elementoHTML = `
                <div class="templatearticolo">
                    <div class="np">${value.nomeProdotto}</div>
                    <div class="imgprodotto"><img src="${imageUrl}" alt="${value.nomeProdotto}"></div>
                    <div class="info">
                        <div class="descrizione">${value.Descrizione}</div>
                        <div class="contenitoreprezzo">
                            <div class="prezzoa">${value.Euro}</div>
                            <div class="prezzob">${value.Centesimi}</div>
                        </div>
                    </div>
                </div>`;

            // Determina la classe della pagina e aggiungi l'elemento HTML al contenuto del frame corrispondente
            let iframeClass = '';
            
            switch (value.Pagina) {
                case 'primaA4':
                    iframeClass = '.pagina_1_a4 iframe';
                    spanValiditaDa_A4.textContent = convertDateFormat(inputDataInizioA4.value);
                    spanValiditaA_A4.textContent = convertDateFormat(inputDataFineA4.value);
                    break;
                case 'secondaA4':
                    iframeClass = '.pagina_2_a4 iframe';
                    break;
                case 'pagina1_web':
                    iframeClass = '.pagina_1_web iframe';
                spanValiditaDa_Web.textContent = convertDateFormat(inputDataInizioWeb.value);
                spanValiditaA_Web.textContent = convertDateFormat(inputDataFineWeb.value);
                    break;
                case 'salumeria_web':
                    iframeClass = '.pagina_salumeria_web iframe';
                    break;
                case 'freschi_web':
                    iframeClass = '.pagina_freschi_web iframe';
                    break;
                case 'surgelati_web':
                    iframeClass = '.pagina_surgelati_web iframe';
                    break;
                case 'dispensa_web':
                    iframeClass = '.pagina_dispensa_web iframe';
                    break;
                case 'bevande_web':
                    iframeClass = '.pagina_bevande_web iframe';
                    break;
                case 'igiene_web':
                    iframeClass = '.pagina_igiene_web iframe';
                    break;
                case 'puliziacasa_web':
                    iframeClass = '.pagina_puliziacasa_web iframe';
                    break;
                default:
                    console.error('Pagina non riconosciuta:', value.Pagina);

                    continue; // Passa al prossimo elemento
            }
            
            // Aggiungi l'elemento HTML al contenuto del frame corrispondente
            if (!htmlContentFrames[iframeClass]) {
                htmlContentFrames[iframeClass] = '';
            }
            htmlContentFrames[iframeClass] += elementoHTML;
        }

        // Inserisci il contenuto HTML nei rispettivi frame
        for (const iframeClass in htmlContentFrames) {
            const iframe = document.querySelector(iframeClass);
            if (iframe) {
                const iframeDocument = iframe.contentWindow.document;
                const contentContainer = iframeDocument.querySelector('.paginaContainer');
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



// const optionss = {
//     filename: 'Test.pdf',
//     margin: 1,
//     image: { type: 'jpeg', quality: 0.98 },

//     html2canvas:  { 
//         dpi: 300,
//         scale: 2, // Aumenta il valore di scale per una maggiore risoluzione
//         useCORS: true, // Abilita l'uso di CORS per il caricamento delle immagini esterne 
//         letterRendering: true,
//      },

//     jsPDF: { unit: '', format: 'letter', orientation: 'portrait' },
//     pagebreak:    { mode: ['avoid-all', 'css'] },
//     enableLinks: true,

//     background: true,
//     autoPaging: true // Imposta autoPaging su false per evitare la suddivisione del contenuto su più pagine
// };



const anteprimaPdf = document.querySelectorAll(".anteprima");
anteprimaPdf.forEach(btnAnteprima => {
    btnAnteprima.addEventListener("click", () => { generaElementi() });
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
