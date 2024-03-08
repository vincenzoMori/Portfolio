function loadContent(contentToLoad, params) {
    const mainContent = $('#main-content');

    const errorCallback = (xhr, status, error) => {
        console.log("Something went wrong while loading the category: ", status, error);
        mainContent.load('../pages/404.html');
    };

    cleanUpMobileCallbacks();

    if (contentToLoad) { // Property file on navigation.js is present
        showDetails(contentToLoad.includes('slideshow.html'))
        mainContent.load(contentToLoad, function (response, status, xhr) {
            if (status === "error") {
                errorCallback(xhr, status, xhr.statusText);
            }
        });
    } else { // Property file on navigation.js is not present
        showDetails(false);
        mainContent.load('../pages/404.html');
        return;
    }

    const categoryLink = document.querySelector('.category[href*="' + params.category + '"]');

    const subcategoryLink = params.subcategory
        ? document.querySelector('.subcategory[id*="' + params.category + '-child"][href*="' + params.subcategory + '"]')
        : null;

    setActive(categoryLink, subcategoryLink);

    const newUrl = getPathname() + '?category=' + params.category +
        (params.subcategory ? '&subcategory=' + params.subcategory : '');

    window.operaId = getQueryParam('operaId');
    window.history.pushState({}, '', newUrl);

    let category = getCategoryObject(params.category).text;
    let subcategory = getSubcategoryObject(params.category, params.subcategory)?.text;
    document.getElementById("breadcrums").innerHTML = (category + (subcategory ? ' / ' + subcategory : '')).toUpperCase();
}

function loadPage() {
    const categoryToLoad = getCategoryUrl();
    const subcategoryToLoad = getSubcategoryUrl();
    const contentToLoad = getFileFromParams(categoryToLoad, subcategoryToLoad);

    loadContent(contentToLoad?.url, { category: contentToLoad?.category, subcategory: contentToLoad?.subcategory });
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
        closeNavbar();
});

createMenu();
loadPage();
