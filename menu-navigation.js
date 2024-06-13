import { togglePage } from "./form-wizard.js";


function toggleDisplay(cont, style1, style2) {
    if (cont.style.display === style1 || cont.style.display === "") {
        cont.style.display = style2;
    } else {
        cont.style.display = style1;
    }
}


function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

const navBarItem = document.querySelectorAll('.navbar-item');
const contNavbarItem = document.querySelectorAll('.cont-navbar-item');

navBarItem.forEach(function(section) {
    section.addEventListener('click', function() {
        let contSee = document.querySelector('.cont-page[style="display: flex;"]');
        
        togglePage(this.id, contSee, "flex");

        navBarItem.forEach(function(navbarItem) {
            navbarItem.parentNode.classList.remove('activeBtn');
        });

        this.parentNode.classList.add('activeBtn');
    });
});


const navbarMenuCont = document.querySelector('.navbar');
const btnToggle = document.querySelector('.button-menu');

const navBarMenuCont = document.querySelector('.navbar-menu');
const navTitle = document.querySelector('.navbar-title');
const contInternMenu = document.querySelector('.cont-intern-nav ')

const spanIcon = btnToggle.querySelector('span');
const container = document.querySelector('.container_all_pages');


btnToggle.addEventListener('click', function () {

    toggleClass(navbarMenuCont, 'toggle');
    toggleClass(spanIcon, 'rotate');
    
    toggleClass(contInternMenu, 'hidden');
    // toggleDisplay(navBarMenuCont,"flex", "none");
    // toggleDisplay(navTitle,"flex", "none");
});


const btnUserArrow = document.querySelector('.ri-arrow-down-s-line');
const btnUserCont = document.querySelector('.cont-user-logo');
const contUserInfo = document.querySelector('.cont-user-info');

btnUserArrow.addEventListener('click', () => {
    toggleDisplay(contUserInfo, "none", "flex");
});

btnUserCont.addEventListener('click', () => {
    toggleDisplay(contUserInfo, "none", "flex");
});
