// getters and setters for all the variables used in the app

function getQueryParam(param, url = null) {
    const searchParams = url ? new URL(url).searchParams : new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

function getPathname() {
    return window.location.pathname;
}

function getCategoryUrl() {
    return getQueryParam('category');
}

function getSubcategoryUrl() {
    return getQueryParam('subcategory');
}

// get from navigation.js 
function getCategoryObject(category) {
    const categoryObject = routes.find(item => item.href === category);
    if (categoryObject) {
        categoryObject.index = routes.findIndex(item => item.href === category);
    }
    return categoryObject;
}

function getSubcategoryObject(category, subcategory) {
    const categoryObject = getCategoryObject(category);
    if (!categoryObject || !hasSubcategories(category) || !subcategory) {
        return null;
    }
    const subcategoryObject = categoryObject.subcategories.find(item => item.href === subcategory);
    if (!subcategoryObject) {
        return null;
    }
    subcategoryObject.index = categoryObject.subcategories.findIndex(item => item.href === subcategory);
    return subcategoryObject;
}

function hasSubcategories(category) {
    return getCategoryObject(category).subcategories ? true : false;
}

function getCategoryFromIndex(index) {
    return routes[index];
}