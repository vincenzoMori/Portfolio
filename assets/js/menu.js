let activeObjects = [];
let basePath = getPathname() === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'

var menuContainer;

function createMenuElements() {
    menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        routes.forEach((route, index) => {
            var a = document.createElement('a');
            a.href = basePath + 'category=' + route.href;
            a.classList.add('category', 'fade-in-cascade');
            a.innerHTML = route.text;
            a.id = route.href; // ID univoco per la categoria
            menuContainer.appendChild(a);

            if (route.subcategories) {
                var subMenu = document.createElement('div');
                subMenu.classList.add('subMenu');
                subMenu.id = 'subMenu-' + route.href; // ID univoco per il sottomenu
                route.subcategories.forEach(subcategory => {
                    var subA = document.createElement('a');
                    subA.classList.add('subcategory', 'fade-in-cascade');
                    subA.id = route.href + '-child'; // ID univoco per la sottocategoria
                    subA.href = basePath + 'category=' + route.href + '&subcategory=' + subcategory.href;
                    subA.innerHTML = subcategory.text;
                    subMenu.appendChild(subA);
                });
                menuContainer.appendChild(subMenu);
            }

        });
        handleCategorySelection(null);
    }
}

function handleCategorySelection(index) {
    // Seleziona tutte le sottocategorie e le nasconde
    var subMenus = menuContainer.querySelectorAll('.subMenu');
    subMenus.forEach(function (subMenuEl) {
        subMenuEl.classList.add('hide');
    });

    // Mostra le sottocategorie della categoria selezionata se il path non contiene index.html
    if (!isIndex()) {
        var selectedSubMenu = menuContainer.querySelector('#subMenu-' + (index ? index : getCategoryUrl()));
        if (selectedSubMenu) {
            selectedSubMenu.classList.remove('hide');
        }
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

function removeActiveClass() {
    var links = document.querySelectorAll('.category, .subcategory');
    links.forEach(link => {
        link.classList.remove('active');
    });

}

function createMenuListeners() {
    const menuLinks = document.querySelectorAll('.category, .subcategory');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var linkClicked = event.target.href;
            var category = getQueryParam('category', linkClicked);
            var subcategory = getQueryParam('subcategory', linkClicked);
            var contentUrl = getFileFromParams(category, subcategory);

            handleCategorySelection(category);

            if (!contentUrl || category === getCategoryUrl() && subcategory === getSubcategoryUrl())
                return;

            category = contentUrl.category;
            subcategory = contentUrl.subcategory;

            removeActiveClass()

            if ((!hasSubcategories(category) || subcategory)) {
                loadContent(contentUrl.url, { category, subcategory });
            }
            if (window.isMobile && (!hasSubcategories(category) || (hasSubcategories(category) && subcategory))) {
                closeNavbar();
            }
        });
    });
}

function createMenuContainer() {
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
}

function createMenu() {
    if (!isIndex())
        createMenuContainer();
    createMenuElements();
    if (!isIndex())
        createMenuListeners();
}

// called when the page is loaded
// and when the mode is changed
onMobileChange(() => {
    if (!isIndex()) {
        createMenu();
        if (activeObjects)
            setActive(...activeObjects);
    }
});

//create the menu automatically only if the page
//is the index.html

if (isIndex()) {
    createMenu();
}