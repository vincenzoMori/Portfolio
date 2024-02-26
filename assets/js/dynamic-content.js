function getFileFromParams(categoryToLoad, subcategoryToLoad = null) {
    const categoryIndex = routes.findIndex(item => item.href === categoryToLoad);

    if (categoryIndex !== -1) {
        const category = getCategoryFromIndex(categoryIndex);
        const subcategories = category.subcategories;

        if (subcategories && !subcategoryToLoad && !window.isMobile) {
            subcategoryToLoad = subcategories[0].href;
        }

        const contentToLoad = subcategories && subcategoryToLoad
            ? subcategories.find(subcategory => subcategory.href === subcategoryToLoad).file
            : category.file;


        return {
            url: contentToLoad,
            category: categoryToLoad,
            subcategory: subcategoryToLoad
        };
    }

    return null;
}

function loadContent(contentToLoad, params) {
    const mainContent = $('#main-content');

    const errorCallback = (xhr, status, error) => {
        console.log("Something went wrong while loading the category: ", status, error);
        mainContent.load('../pages/404.html');
    };

    if (contentToLoad) {
        showDetails(contentToLoad.includes('slideshow.html'))
        mainContent.load(contentToLoad, function (response, status, xhr) {
            if (status === "error") {
                errorCallback(xhr, status, xhr.statusText);
            }
        });
    } else {
        mainContent.load('../pages/404.html');
    }

    const categoryLink = document.querySelector('.category[href*="' + params.category + '"]');

    const subcategoryLink = params.subcategory
        ? document.querySelector('.subcategory[id*="' + params.category + '-child"][href*="' + params.subcategory + '"]')
        : null;

    setActive(categoryLink, subcategoryLink);

    const newUrl = getPathname() + '?category=' + params.category +
        (params.subcategory ? '&subcategory=' + params.subcategory : '');

    window.opera = getQueryParam('opera');
    window.history.pushState({}, '', newUrl);

    let category = getCategoryObject(params.category).text;
    let subcategory = getSubcategoryObject(params.category, params.subcategory)?.text;
    document.getElementById("breadcrums").innerHTML = (category + (subcategory ? ' / ' + subcategory : '')).toUpperCase();
}

function loadPage() {
    const categoryToLoad = getCategoryUrl();
    const subcategoryToLoad = getSubcategoryUrl();
    const contentToLoad = getFileFromParams(categoryToLoad, subcategoryToLoad);

    if (contentToLoad) {
        loadContent(contentToLoad.url, { category: contentToLoad.category, subcategory: contentToLoad.subcategory });
    } else {
        showDetails(false);
        $('#main-content').load('../pages/404.html');
    }
}

function showDetails(show) {
    const details = document.getElementById('details');
    if (!details) return;
    details.style.display = show ? 'block' : 'none';
    details.style.animationDelay = '0s';
}

$("#openBtnNav").on("click", function () {
    openNavbar();
});

$("#closeBtnNav").on("click", function () {
    closeNavbar();
});

function openNavbar() {
    $(".sidebar-mobile").fadeIn();
    $(".sidebar-mobile-container").removeClass("closed").animate({ right: 0 }, 500);
}

function closeNavbar() {
    resetSubmenusVisibility();
    $(".sidebar-mobile-container").animate({ right: -300 }, 500, function () {
        $(this).addClass("closed");
        $(".sidebar-mobile").fadeOut();
    });
}

function isNavbarOpen() {
    return !$(".sidebar-mobile-container").hasClass("closed");
}

onMobileChange(() => {
    if (!window.isMobile && isNavbarOpen())
        console.log('closing navbar');
        closeNavbar();
});

createMenu();
loadPage();
