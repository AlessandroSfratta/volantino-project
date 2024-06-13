import { togglePage } from "./form-wizard.js";


const navBarItem = document.querySelectorAll('.navbar-item');
const contNavbarItem = document.querySelectorAll('.cont-navbar-item')




navBarItem.forEach(function(section) {
    section.addEventListener('click', function() {

        let contSee = document.querySelector('.cont-page[style="display: flex;"]');
        
        togglePage(this.id, contSee,"flex");

        navBarItem.forEach(function(navbarItem) {
            navbarItem.parentNode.classList.remove('activeBtn');
        });

        this.parentNode.classList.add('activeBtn');
    });
});



const navbarMenuCont = document.querySelector('.navbar');
const btnToggle = document.querySelector('.button-menu');
const spanIcon = btnToggle.querySelector('span');
const container = document.querySelector('.container_all_pages');

btnToggle.addEventListener('click', function () {
    const isNavbarOpen = navbarMenuCont.classList.contains('toggle');
    
    if (isNavbarOpen) {
        navbarMenuCont.classList.remove('toggle');
        spanIcon.classList.remove('rotate');
        // container.classList.remove('full-width');
    } else {
        navbarMenuCont.classList.add('toggle');
        spanIcon.classList.add('rotate');
        // container.classList.add('full-width');
    }
});