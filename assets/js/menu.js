const currentPathname = window.location.pathname;
let basePath = currentPathname === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'

var menuContainer = document.getElementById('menu-container');
if (menuContainer) {
    routes.forEach(route => {
        if (route.href === 'spacer') {
            var spacer = document.createElement('div');
            spacer.classList.add('spacer');
            menuContainer.appendChild(spacer);
            return;
        }
        var a = document.createElement('a');
        a.href = basePath + 'category=' + route.href;
        a.classList.add('category', 'fade-in-cascade');
        a.innerHTML = route.text;
        menuContainer.appendChild(a);
        if (route.subcategories && currentPathname.includes('dynamic-page.html')) {
            var subMenu = document.createElement('div');
            subMenu.classList.add('subMenu');
            route.subcategories.forEach(subcategory => {
                var subA = document.createElement('a');
                subA.classList.add('subcategory', 'fade-in-cascade');
                subA.href = basePath + 'category=' + route.href + '&subcategory=' + subcategory.href;
                subA.innerHTML = subcategory.text;
                subMenu.appendChild(subA);
            });
            menuContainer.appendChild(subMenu);
        }
    });
}

// funzione per aggiungere la classe active al link selezionato
function setActive(...elements) {
    var links = document.querySelectorAll('.category, .subcategory');
    links.forEach(link => {
        link.classList.remove('active');
        elements.forEach(element => {
            if (link.href === element.href) {
                link.classList.add('active');
            }
        });
    });
}