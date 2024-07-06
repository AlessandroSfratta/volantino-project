
document.addEventListener("DOMContentLoaded", () => {

    const dinamicParagraph = document.querySelectorAll('.prezzoDinamico');

    const checkbox1 = document.getElementById('interruttore-toggle-1');

    checkbox1.addEventListener('change', () => {

        dinamicParagraph.forEach( (paragraph) => {

            const paragraphVal = parseInt(paragraph.textContent);
            
            if(  checkbox1.checked) {
                paragraph.textContent = Math.round(paragraphVal * 12) 
            } else {
                paragraph.textContent = Math.round(paragraphVal / 12);
            }
            
   
        })
        
    });
    

    const checkbox2 = document.getElementById('interruttore-toggle-2');

    checkbox2.addEventListener('change', () => {

        dinamicParagraph.forEach( (paragraph)=> {

            const paragraphVal = parseInt(paragraph.textContent);

            if(checkbox2.checked) {
                paragraph.textContent = Math.round(paragraphVal * 1.22) 
            } else {
                paragraph.textContent = Math.round(paragraphVal / 1.22);
            }

        }) 

    })

});
    

