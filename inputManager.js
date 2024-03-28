document.addEventListener("DOMContentLoaded", function() {

    let cmnToggleCounter = 15; 


    function addEventListenersToNewElements() {

        let managementIcons = document.querySelectorAll(".cont-manegament");

        managementIcons.forEach(function(icon) {
            icon.removeEventListener("click", clickHandler);
        });

        managementIcons.forEach(function(icon) {
            icon.addEventListener("click", clickHandler);
        });


    }


    function clickHandler(event) {

     let target = event.target;

        if (target.classList.contains("close")) {

            let contInput = target.closest('.cont-input');
            let inputRows = contInput.querySelectorAll('.input-rows');

            if (inputRows.length > 1) {
                target.closest(".input-rows").remove();
                updateCounter(contInput);

            } else {
                alert("Impossibile eliminare l'ultima riga.");
            }

        } else if (target.classList.contains("add")) {

         let formStep = target.closest('.form-step');

            let pagina = formStep.getAttribute('data-pagina');

            let limiteMassimo = getLimiteMassimo(pagina);
            let contaElementi = contaElementiPagina(pagina);

            
            if (contaElementi < limiteMassimo) {

                console.log(limiteMassimo);

                console.log(contaElementi)


            let currentInputRows = target.closest(".input-rows");
                let newInputRows = currentInputRows.cloneNode(true);
                currentInputRows.insertAdjacentElement("afterend", newInputRows);

                newInputRows.querySelectorAll('input').forEach(function(input) {
                    input.value = ''; 
                });

              
                newInputRows.querySelectorAll('img').forEach(function(img) {
                    img.src = '';
                });

                cmnToggleCounter++;
                let newToggleId = 'cmn-toggle-' + cmnToggleCounter;

                newInputRows.querySelector(".cmn-toggle").id = newToggleId;
                newInputRows.querySelector("label").setAttribute("for", newToggleId);

                updateCounter(target.closest('.cont-input'));
                
               

            } else {

                // console.log(limiteMassimo);

                // console.log(contaElementi);

                alert("Limite massimo di elementi raggiunto per questa pagina.");
            }

            addEventListenersToNewElements();
        } else if (target.classList.contains("up")) {

            var currentRow = target.closest(".input-rows");
            var previousRow = currentRow.previousElementSibling;
            if (previousRow) {
                currentRow.parentNode.insertBefore(currentRow, previousRow); }

            } else if (target.classList.contains("down")) {

            var currentRow = target.closest(".input-rows");
            var nextRow = currentRow.nextElementSibling;
            if (nextRow) {
                currentRow.parentNode.insertBefore(nextRow, currentRow);
            } 
        }
    }



    function getLimiteMassimo(tipoVolantino) {
        switch (tipoVolantino) {
            case "primaA4":
                return 6;
            case "secondaA4":
                return 9;
            default:
                return Infinity;
        }
    }
    
    
    
    // data-pagina="primaWeb"
    // data-pagina="salumeriaWeb"
    // data-pagina="freschiWeb"
    // data-pagina="dispensaWeb"
    // data-pagina="bevandeWeb"
    // data-pagina="igieneWeb"
    // data-pagina="puliziacasaWeb"

    

    // Funzione per contare gli elementi .input-rows in una specifica pagina
function contaElementiPagina(pagina) {
        let paginaElements = document.querySelectorAll('.form-step[data-pagina="' + pagina + '"] .input-rows');
        return paginaElements.length;
    }


    function updateCounter(contInput) {

        console.log(contInput);

        let counter = contInput.querySelector('.counter');
        let pagina = contInput.closest('.form-step').getAttribute('data-pagina');
        let numeroElementi = contaElementiPagina(pagina);
        counter.textContent = numeroElementi;
        
    }

addEventListenersToNewElements();

})