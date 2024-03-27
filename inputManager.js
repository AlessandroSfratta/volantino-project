document.addEventListener("DOMContentLoaded", function() {

    let cmnToggleCounter = 10; // Inizia da 3 per il terzo toggle

    // Funzione per aggiungere gli event listener ai nuovi elementi
    function addEventListenersToNewElements() {
        // Selezioniamo tutti gli elementi con la classe .cont-manegament e aggiungiamo un event listener per il clic
        var managementIcons = document.querySelectorAll(".cont-manegament");

        // Rimuoviamo gli event listener dagli elementi esistenti
        managementIcons.forEach(function(icon) {
            icon.removeEventListener("click", clickHandler);
        });

        // Aggiungiamo gli event listener agli elementi esistenti e ai nuovi elementi creati
        managementIcons.forEach(function(icon) {
            icon.addEventListener("click", clickHandler);
        });
    }


    // Funzione per gestire il clic sugli elementi
    function clickHandler(event) {
        var target = event.target;
        // Verifichiamo quale icona è stata cliccata
        if (target.classList.contains("close")) {

            var contInput = target.closest('.cont-input');
            var inputRows = contInput.querySelectorAll('.input-rows');
            if (inputRows.length > 1) {
                target.closest(".input-rows").remove();
                updateCounter(contInput);

            } else {
                alert("Impossibile eliminare l'ultima riga.");
            }

        } else if (target.classList.contains("add")) {

            var formStep = target.closest('.form-step');
            var pagina = formStep.getAttribute('data-pagina');
            var tipoVolantino = formStep.getAttribute('data-type');

            // Ottieni il limite massimo in base al tipo di volantino
            let limiteMassimo = getLimiteMassimo(tipoVolantino);
            let contaElementi = contaElementiPagina(pagina);
            // Controlla se il limite massimo è stato superato
            if (contaElementi < limiteMassimo) {

                console.log(limiteMassimo);

                console.log(contaElementi)


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

                // Aggiorniamo il contatore
                updateCounter(target.closest('.cont-input'));
                
                // Aggiungiamo gli event listener ai nuovi elementi creati
                addEventListenersToNewElements();
            } else {
                // Altrimenti, mostra un messaggio di errore
                alert("Limite massimo di elementi raggiunto per questa pagina.");
            }
        }
    }

    // Funzione per ottenere il limite massimo in base al tipo di volantino
    function getLimiteMassimo(tipoVolantino) {
        switch (tipoVolantino) {
            case "primaA4": return 6;
            case "secondaA4": return 9;
            default: return Infinity;
        }
    }


    // Funzione per contare gli elementi .input-rows in una specifica pagina
function contaElementiPagina(pagina) {
        var paginaElements = document.querySelectorAll('.form-step[data-pagina="' + pagina + '"] .input-rows');
        return paginaElements.length;
    }


// Funzione per aggiornare il counter
function updateCounter(contInput) {
    var counter = contInput.querySelector('.counter');
    var pagina = contInput.closest('.form-step').getAttribute('data-pagina');
    var numeroElementi = contaElementiPagina(pagina);
    counter.textContent = numeroElementi;

}

addEventListenersToNewElements();


})