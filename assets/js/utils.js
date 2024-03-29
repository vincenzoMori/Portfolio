// CONSTANTS
const GET_DATA = "https://script.google.com/macros/s/AKfycbzlGrnhwyEe7Pa6Ra9B0QKoJVtkoZchk77n_bxLLmqMYYUf_SSZM9dcZpM6nBJ4jDVVtA/exec"
const CONTACT = "https://script.google.com/macros/s/AKfycbxeLLHeW6GSaOeotRtsbO-uQJuR5bt5nhJGtn4Uy0xuAySQfJvNRWgaWtJWIcOJy73C/exec";

// getters and setters for all the variables used in the app

function getQueryParam(param, url = null) {
    const searchParams = url ? new URL(url).searchParams : new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

function stopPropagation(event) {
    event.stopPropagation();
};


function getPathname() {
    return window.location.pathname;
}

function isIndex() {
    return getPathname().includes('index.html');
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

function getFileFromParams(categoryToLoad, subcategoryToLoad = null) {
    const categoryIndex = routes.findIndex(item => item.href === categoryToLoad);

    if (categoryIndex !== -1) {
        const category = getCategoryFromIndex(categoryIndex);
        const subcategories = category.subcategories;

        if (subcategories && !subcategoryToLoad && window.isMobile && document.readyState == "complete") return null;
        subcategoryToLoad = subcategories && !subcategoryToLoad ? subcategories[0].href : subcategoryToLoad;
        if (categoryToLoad === getCategoryUrl() && subcategoryToLoad === getSubcategoryUrl() && document.readyState == 'complete') return null;

        const contentToLoad = subcategories && subcategoryToLoad
            ? subcategories.find(subcategory => subcategory.href === subcategoryToLoad)?.file
            : category.file;

        return {
            url: contentToLoad,
            category: categoryToLoad,
            subcategory: subcategoryToLoad
        };
    }

    return null;
}

// Abort controllers
let abortControllers = [];

function addAbortController(controller) {
    abortControllers.push(controller);
}

function removeAbortController(controller) {
    abortControllers = abortControllers.filter(c => c !== controller);
}

function triggerAbortControllers() {
    abortControllers.forEach(controller => {
        controller.abort();
    });
}

function emptyAbortControllers() {
    abortControllers = [];
}

function isEmptyAbortControllers() {
    return abortControllers.length === 0;
}

// Spinner
function showSpinner() {
    var spinner = document.getElementsByClassName('spinner-grow')[0];
    if (!['about', 'contacts'].includes(getCategoryUrl())) { // Check if the category is about or contacts, otherwise show the spinner
        spinner.style.display = 'block';
    }
    spinner.style.top = getCategoryUrl() === 'works' && window.isMobile ? '30%' : '50%';

}

function hideSpinner() {
    if (isEmptyAbortControllers()) { // Check if there is a fetch in progress, otherwise hide the spinner
        var spinner = document.getElementsByClassName('spinner-grow')[0];
        spinner.style.display = 'none';
    }
}