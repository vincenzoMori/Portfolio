const currentPathname = window.location.pathname;
let basePath = currentPathname === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'
let activeObjects = null;

function createMenu() {
    var menuContainer = document.getElementById('menu-container');
    console.log("MENU: ", menuContainer);
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
