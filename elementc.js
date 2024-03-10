
import { jsonData } from './app.js';


async function convertToDataURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}


async function generaElementi() {
    try {
        const prodottiJSON = jsonData;

        let htmlContent = '<h1>Prodotti</h1>';
        for (const [key, value] of Object.entries(prodottiJSON)) {

            const imageData = await convertToDataURL(value.Immagine);
            // Converti il blob dell'immagine in un URL per includerlo nell'HTML
            const imageUrl = URL.createObjectURL(imageData);

            // Aggiungi il contenuto HTML con l'immagine
            htmlContent += `
                <div class="content-cont">
                    <p>Nome Prodotto: ${value.Nome_Prodotto}</p>
                    <img src="${imageUrl}" alt="${value.Nome_Prodotto}">
                    <p>Descrizione: ${value.Descrizione}</p>
                    <p>Prezzo: ${value.Prezzo} €</p>
                </div>
            `;
        }

         content = document.getElementById('pdf-content');

        // Visualizza il contenuto HTML nella pagina
        content.innerHTML = htmlContent;
    } catch (error) {
        console.error('Errore nel caricamento dei dati JSON:', error);
    }
}


let content;


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
        format: 'letter', 
        orientation: 'portrait',
        height: 1000
    }, 

    pagebreak: { mode: ['css', 'legacy'] },
    enableLinks: true,
    background: true,
    autoPaging: true 
};



document.addEventListener('DOMContentLoaded', () => {
    document.querySelector(".anteprima").addEventListener("click", generaElementi);
    document.querySelector(".btn-confirm").addEventListener("click", convertiInPDF);
});



function convertiInPDF() {
    
    html2pdf().from(content).set(options).save();

    html2pdf().from(content).set(options).outputPdf('blob').then(pdfBlob => {
        
        // Crea un oggetto FormData e aggiungi il file PDF
        const formData = new FormData();
        formData.append('pdf_content', pdfBlob, 'my-document.pdf');

        // Invia il contenuto PDF al server PHP tramite una richiesta AJAX
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
            console.log(data); // Visualizza eventuali messaggi di successo o errore dal server
        })
        .catch(error => {
            console.error('Errore durante il salvataggio del PDF:', error);
        });
    });
}
