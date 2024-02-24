function getQueryParam(param, url = null) {
    const searchParams = url ? new URL(url).searchParams : new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

function getFileFromParams(categoryToLoad, subcategoryToLoad = null) {
    const categoryIndex = routes.findIndex(item => item.href === categoryToLoad);

    if (categoryIndex !== -1) {
        const category = routes[categoryIndex];
        const subcategories = category.subcategories;

        if (subcategories && !subcategoryToLoad) {
            subcategoryToLoad = subcategories[0].href;
        }

        const contentUrl = subcategories && subcategoryToLoad
            ? subcategories.find(subcategory => subcategory.href === subcategoryToLoad).file
            : category.file;

        showDetails(contentUrl && contentUrl.includes('slideshow.html'))

        return {
            url: contentUrl,
            category: categoryToLoad,
            subcategory: subcategoryToLoad
        };
    }

    return null;
}

function loadContent(contentUrl, params) {
    const mainContent = $('#main-content');
    const errorCallback = (xhr, status, error) => {
        console.log("Something went wrong while loading the category: ", status, error);
    };

    if (contentUrl) {
        mainContent.load(contentUrl, function (response, status, xhr) {
            if (status === "error") {
                errorCallback(xhr, status, xhr.statusText);
            }
        });
    } else {
        mainContent.load('../pages/404.html');
    }

    const categoryLink = document.querySelector('.category[href*="' + params.category + '"]');
    const subcategoryLink = params.subcategory
        ? document.querySelector('.subcategory[href*="' + params.subcategory + '"]')
        : null;

    setActive(categoryLink, subcategoryLink);

    const newUrl = window.location.pathname + '?category=' + params.category +
        (params.subcategory ? '&subcategory=' + params.subcategory : '');

    window.opera = getQueryParam('opera');
    window.history.pushState({}, '', newUrl);

    document.getElementById("breadcrums").innerHTML = (params.category + (params.subcategory ? ' / ' + params.subcategory : '')).toUpperCase();
}

function loadPage() {
    const categoryToLoad = getQueryParam('category');
    const subcategoryToLoad = getQueryParam('subcategory');
    const contentUrl = getFileFromParams(categoryToLoad, subcategoryToLoad);

    if (contentUrl) {
        loadContent(contentUrl.url, { category: contentUrl.category, subcategory: contentUrl.subcategory });
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
    $(".sidebar-mobile-container").animate({ right: -300 }, 500, function () {
        $(this).addClass("closed");
        $(".sidebar-mobile").fadeOut();
    });
}

onMobileChange(() => {
    if (!window.isMobile)
        closeNavbar();
});

callMobileCallbacks();
loadPage();
