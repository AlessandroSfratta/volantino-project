
import { jsonData } from './app.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}


let content;

async function generaElementi(cont) {
    
    try {

        const prodottiJSON = jsonData;

        let htmlContent = ` <div class="templatearticolo">
            <div class="np">${value.nomeProdotto}</div>
            <div class="imgprodotto"><img src="${imageUrl}" alt="${value.nomeProdotto}"></div>
            <div class="info">
                <div class="descrizione">${value.Descrizione}</div>
                <div class="contenitoreprezzo">
                    <div class="prezzoa">${value.Prezzo}</div>
                    <div class="prezzob"></div>
                </div>
            </div>
        </div>`;;


        for (const [key, value] of Object.entries(prodottiJSON)) {

            const imageData = await convertToDataURL(value.Immagine);
            // Converti il blob dell'immagine in un URL per includerlo nell'HTML
            const imageUrl = URL.createObjectURL(imageData);

        
        }

     content = document.querySelector(cont);

        // Visualizza il contenuto HTML nella pagina
        content.innerHTML = htmlContent;

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




const pdfCont1 = ".pdf-content1";
const anteprimaPdf1 = document.querySelector("#anteprima1");
anteprimaPdf1.addEventListener("click", () => { generaElementi(pdfCont1) });

const pdfCont2 = ".pdf-content2";
const anteprimaPdf2 = document.querySelector("#anteprima2");
anteprimaPdf2.addEventListener("click", () => { generaElementi(pdfCont2) });



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
