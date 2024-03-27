import { repeatLabelInteraction } from "./app.js";


document.addEventListener("DOMContentLoaded", function() {


    let cmnToggleCounter = 10; // Inizia da 3 per il terzo toggle

    // Funzione per aggiungere gli event listener ai nuovi elementi
    function addEventListenersToNewElements() {
        // Selezioniamo tutti gli elementi con la classe .cont-manegament e aggiungiamo un event listener per il clic
        var managementIcons = document.querySelectorAll(".cont-manegament");

        managementIcons.forEach(function(icon) {
            icon.addEventListener("click", function(event) {
                var target = event.target;
                // Verifichiamo quale icona è stata cliccata
                if (target.classList.contains("close")) {
                    // Se è stato cliccato l'elemento close, eliminiamo l'intera riga
                    target.closest(".input-rows").remove();
                } else if (target.classList.contains("up")) {
                    // Se è stato cliccato l'elemento up, spostiamo la riga sopra
                    var currentRow = target.closest(".input-rows");
                    var previousRow = currentRow.previousElementSibling;
                    if (previousRow) {
                        currentRow.parentNode.insertBefore(currentRow, previousRow); }
                        // Aggiorniamo gli eventi sulla riga spostata
                } else if (target.classList.contains("down")) {
                    // Se è stato cliccato l'elemento down, spostiamo la riga sotto
                    var currentRow = target.closest(".input-rows");
                    var nextRow = currentRow.nextElementSibling;
                    if (nextRow) {
                        currentRow.parentNode.insertBefore(nextRow, currentRow);
                    }
                } else if (target.classList.contains("add")) {
                    // Se è stato cliccato l'elemento add, cloniamo il contenitore .input-rows e lo aggiungiamo come fratello al contenitore attuale
                    var currentInputRows = target.closest(".input-rows");
                    var newInputRows = currentInputRows.cloneNode(true);
                    currentInputRows.insertAdjacentElement("afterend", newInputRows);

        // Resettiamo il contenuto dei nuovi input
        newInputRows.querySelectorAll('input').forEach(function(input) {
            input.value = ''; // Resetta il valore dell'input
        });

        // Resettiamo l'attributo src delle nuove immagini
        newInputRows.querySelectorAll('img').forEach(function(img) {
            img.src = ''; // Resetta l'attributo src dell'immagine
        });

      
                    // Incrementiamo il contatore per i cmn-toggle-
                    cmnToggleCounter++;
                    var newToggleId = 'cmn-toggle-' + cmnToggleCounter;

                    // Modifichiamo l'id del toggle nel nuovo elemento
                    newInputRows.querySelector(".cmn-toggle").id = newToggleId;
                    newInputRows.querySelector("label").setAttribute("for", newToggleId);

                    // Aggiungiamo gli event listener ai nuovi elementi creati
                    addEventListenersToNewElements();

                

                }
            });
        });
    }

    // Aggiungiamo gli event listener agli elementi esistenti
    addEventListenersToNewElements();
});
