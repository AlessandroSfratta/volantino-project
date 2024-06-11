import { togglePage } from "./form-wizard.js";


const navBarItem = document.querySelectorAll('.navbar-item');

navBarItem.forEach( function (section) {

    section.addEventListener('click', function() {
        let contSee = document.querySelector('.cont-page[style="display: block;"]');
     
        togglePage(this.id,contSee);

    });

})