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

        const details = document.getElementById('details');
        details.style.display = contentUrl && contentUrl.includes('slideshow.html') ? 'block' : 'none';
        details.style.animationDelay = '0s';

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
}

function loadPage() {
    const categoryToLoad = getQueryParam('category');
    const subcategoryToLoad = getQueryParam('subcategory');
    const contentUrl = getFileFromParams(categoryToLoad, subcategoryToLoad);

    if (contentUrl) {
        loadContent(contentUrl.url, { category: contentUrl.category, subcategory: contentUrl.subcategory });
    } else {
        $('#main-content').load('../pages/404.html');
    }
}

document.addEventListener('DOMContentLoaded', function () {
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
        });
    });
});

loadPage();
