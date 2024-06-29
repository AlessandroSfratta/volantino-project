import { jsonData } from "./form-wizard.js";



let filePaths = ['../file comuni/archivio generale.csv', './archivio personale.csv'];

export function prelevaProdotto(searchText, dataType, input) {

    let combinedResults = [];

    function processResults(fileIndex) {

        if (fileIndex < filePaths.length) {

            Papa.parse(filePaths[fileIndex], {
                download: true,
                header: true,
                complete: function(results) {
                    combinedResults = combinedResults.concat(results.data);
                    processResults(fileIndex + 1); // Call the function for the next file
                },
                error: function(error) {
                    console.error('Errore durante il recupero del file:', error);
                }
            });

        } else {
   
            const productListContainer = input.parentElement.querySelector('.suggerimenti-nome-prodotto select');
            productListContainer.innerHTML = '';

            let hasMatches = false;

            combinedResults.forEach(row => {
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
        }
    }

    processResults(0);
}




async function loadCsv(filePath) {

    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
        });
    });


}


async function checkProducts(jsonData) {

    const archiveGeneral = await loadCsv(filePaths[0]);
    const archivePersonal = await loadCsv(filePaths[1]);
    
    const allProducts = [...archiveGeneral, ...archivePersonal];

    const newProducts = {}; // Oggetto per i nuovi prodotti da aggiungere

    // Itera sulle proprietà di jsonData (seguendo la struttura specifica)
    for (let key in jsonData) {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
            const product = jsonData[key];
            const exists = allProducts.some(existingProduct =>
                existingProduct['Nome prodotto'] === product.nomeProdotto &&
                existingProduct['immagine'] === product.Immagine
            );

            if (!exists) {
                // Aggiungi il nuovo prodotto all'oggetto newProducts
                newProducts[key] = {
                    "Nome prodotto": product.nomeProdotto,
                    "immagine": product.Immagine
                };
            }
        }
    }

    return newProducts;
}



async function sendNewProductsToServer(newProducts) {

    try {
        const response = await fetch('./check_edit_csv.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products: newProducts })
        });

        const result = await response.json(); // Supponendo che il server restituisca una risposta JSON

        console.log('Risposta dal server:', result);
    } catch (error) {
        console.error('Errore durante l\'invio dei nuovi prodotti:', error);
    }

}




export async function checkAndAddProducts() {

    try {

        const newProducts = await checkProducts(jsonData);

        if (Object.keys(newProducts).length > 0) {
            console.log('Nuovi prodotti da aggiungere:', newProducts);

            await sendNewProductsToServer(newProducts);

        } else {
            console.log('Tutti i prodotti sono già presenti nei file CSV.');
        }

    } catch (error) {
        console.error('Errore durante il controllo e l\'aggiunta dei prodotti:', error);
    }

}
