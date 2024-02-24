const currentPathname = window.location.pathname;
let basePath = currentPathname === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'

var menuContainer = document.getElementById('menu-container');
let searchParams = new URLSearchParams(window.location.search);
let category = searchParams.get('category');
let subcategory = searchParams.get('subcategory');

if (menuContainer) {
    routes.forEach((route, index) => {
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
        a.id = route.text;
        a.dataset.index = index; // Assegniamo un indice come attributo personalizzato per identificare la categoria
        menuContainer.appendChild(a);

        // Aggiunta del listener per il click sulla categoria
        a.addEventListener('click', function (event) {
            console.log('click')
            event.preventDefault();
            handleCategorySelection(this.dataset.index);
        });

        if (route.subcategories) {
            var subMenu = document.createElement('div');
            subMenu.classList.add('subMenu');
            subMenu.id = 'subMenu-' + index; // ID unico
            route.subcategories.forEach(subcategory => {
                var subA = document.createElement('a');
                subA.classList.add('subcategory', 'fade-in-cascade');
                subA.id = route.text + '-child';
                subA.href = basePath + 'category=' + route.href + '&subcategory=' + subcategory.href;
                subA.innerHTML = subcategory.text;
                subMenu.appendChild(subA);
            });
            menuContainer.appendChild(subMenu);
        }
    });
    hideAll()
}

function handleCategorySelection(index) {
    // Seleziona tutte le sottocategorie e le nasconde
    var subMenus = menuContainer.querySelectorAll('.subMenu');
    subMenus.forEach(function (subMenuEl) {
        subMenuEl.classList.add('hide');
    });

    // Mostra le sottocategorie della categoria selezionata
    var selectedSubMenu = menuContainer.querySelector('#subMenu-' + index);
    if (selectedSubMenu) {
        selectedSubMenu.classList.remove('hide');
    }
}

function setActive(...elements) {
    console.log(elements)
    var links = document.querySelectorAll('.category, .subcategory');
    links.forEach(link => {
        link.classList.remove('active');
        elements.forEach(element => {
            if (element && link.href === element.href) {
                link.classList.add('active');
            }
        });
    });
}

function hideAll() {
    var subMenus = menuContainer.querySelectorAll('.subMenu');
    console.log(subMenus)
    subMenus.forEach(function (subMenuEl) {
        console.log(subMenuEl)
        subMenuEl.classList.add('hide');
    });
}