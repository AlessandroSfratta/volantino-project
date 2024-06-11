import { togglePage } from "./form-wizard.js";


const navBarItem = document.querySelectorAll('.navbar-item');
const contNavbarItem = document.querySelectorAll('.cont-navbar-item')

navBarItem.forEach( function (section) {

    section.addEventListener('click', function() {
        let contSee = document.querySelector('.cont-page[style="display: block;"]');
     
        togglePage(this.id,contSee);

        contNavbarItem.forEach( function (navbarItem) {
        
        const contWithClass = navbar.closest(navbarItem).classList

        contWithClass.contains("activeBtn") ? 
        contWithClass.remove("activeBtn") : contWithClass.add("activeBtn")

        } )

    });

})


const navbarMenuCont = document.querySelector('.navbar');
const btnToggle = document.querySelector('.button-menu');
const spanIcon = btnToggle.querySelector('span');

btnToggle.addEventListener('click', function () {

    navbarMenuCont.classList.contains('toggle') ? 
    navbarMenuCont.classList.remove('toggle') : navbarMenuCont.classList.add('toggle');

    spanIcon.classList.contains('rotate') ? 
    spanIcon.classList.remove('rotate') : spanIcon.classList.add('rotate')

})