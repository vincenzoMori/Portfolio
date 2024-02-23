var menuContainer = document.getElementById('menu-container');
let searchParams = new URLSearchParams(window.location.search);
let category = searchParams.get('category');
let subcategory = searchParams.get('subcategory');

function createMenu() {
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
            a.dataset.index = index; // Assegniamo un indice come attributo personalizzato per identificare la categoria
            menuContainer.appendChild(a);
    
            // Aggiunta del listener per il click sulla categoria
            a.addEventListener('click', function (event) {
                event.preventDefault();
                setActive(this);
                handleCategorySelection(this.dataset.index);
            });
    
            if (route.subcategories && route.href === category) {
                var subMenu = document.createElement('div');
                subMenu.classList.add('subMenu');
                subMenu.id = 'subMenu-' + index; // ID unico
    
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
    var links = document.querySelectorAll('.category, .subcategory');
    activeObjects = elements;
    links.forEach(link => {
        link.classList.remove('active');
        elements.forEach(element => {
            if (element && link.href === element.href) {
                link.classList.add('active');
            }
        });
    });
}

function setListeners() {
    const menuLinks = document.querySelectorAll('.category, .subcategory');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var linkClicked = event.target.href;
            var category = getQueryParam('category', linkClicked);
            var subcategory = getQueryParam('subcategory', linkClicked);
            var contentUrl = getFileFromParams(category, subcategory);
            category = contentUrl.category;
            subcategory = contentUrl.subcategory;
            loadContent(contentUrl.url, { category, subcategory });
            if (window.isMobile) {
                closeNavbar();
            }
        });
    });
}

onMobileChange(() => {
    const menuContainer = document.createElement('div');
    menuContainer.id = 'menu-container';

    const sidebarContent = document.getElementsByClassName('sidebar-content')[0];
    const sidebarMobileContent = document.getElementsByClassName('sidebar-mobile-content')[0];

    if (window.isMobile) {
        try {
            sidebarContent.removeChild(document.getElementById('menu-container'));
        } catch (e) { }
        sidebarMobileContent.appendChild(menuContainer);
    } else {
        try {
            sidebarMobileContent.removeChild(document.getElementById('menu-container'));
        } catch (e) { }
        sidebarContent.insertBefore(menuContainer, sidebarContent.firstChild);
    }

    createMenu();
    setListeners();
    if (activeObjects)
        setActive(...activeObjects);
    
});
