function getQueryParam(param, url = null) {
    if (url !== null) {
        var urlObject = new URL(url);
        var queryParams = new URLSearchParams(urlObject.search);
        return queryParams.get(param);
    }

    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
}

var categoryToLoad = getQueryParam('category');
var subcategoryToLoad = getQueryParam('subcategory');


function loadPage() {
    var contentUrl = getFileFromParams(categoryToLoad, subcategoryToLoad);

    if (contentUrl) {
        loadContent(contentUrl.url, { category: contentUrl.category, subcategory: contentUrl.subcategory });
    } else {
        $('#main-content').load('../pages/404.html');
    }
}

function getFileFromParams(categoryToLoad, subcategoryToLoad = null) {

    const categoryIndex = routes.findIndex(item => {
        return item.href === categoryToLoad;
    });

    if (categoryIndex !== -1 && routes[categoryIndex].subcategories && !subcategoryToLoad) {
        subcategoryToLoad = routes[categoryIndex].subcategories[0].href;
    }

    if (categoryIndex !== -1) {
        if (routes[categoryIndex].subcategories && subcategoryToLoad) {
            var contentUrl = routes[categoryIndex].subcategories.find(subcategory => {
                return subcategory.href === subcategoryToLoad;
            }).file;
        } else {
            var contentUrl = routes[categoryIndex].file;
        }

        let details = document.getElementById('details');
        if (contentUrl && contentUrl.includes('slideshow.html')) {
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
            details.style.animationDelay = '0s';
        }

        return {
            url: contentUrl,
            category: categoryToLoad,
            subcategory: subcategoryToLoad
        };
    }

    return null;
}

function loadContent(contentUrl, params) {
    if (contentUrl) {
        $('#main-content').load(contentUrl, function (response, status, xhr) {
            if (status == "error") {
                console.log("Something went wrong while loading the category: ", xhr.status, xhr.statusText);
            }
        });

    } else {
        $('#main-content').load('../pages/404.html');
    }

    if (params && params.subcategory) {
        var subcategoryLink = document.querySelector('.subcategory[href*="' + params.subcategory + '"]');
        var categoryLink = document.querySelector('.category[href*="' + params.category + '"]');
        setActive(categoryLink, subcategoryLink);
    } else {
        var categoryLink = document.querySelector('.category[href*="' + params.category + '"]');
        setActive(categoryLink);
    }

    var newUrl = window.location.pathname + '?category=' + params.category;
    if (params.subcategory) {
        newUrl += '&subcategory=' + params.subcategory;
    }

    window.opera = getQueryParam('opera');
    window.history.pushState({}, '', newUrl);
}

document.addEventListener('DOMContentLoaded', function () {
    var menuLinks = document.querySelectorAll('.category, .subcategory');
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
