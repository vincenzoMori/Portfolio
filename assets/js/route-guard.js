// Set the production flag
var PROD = false;

// List of allowed paths
var allowedPaths = [
    '/index.html',
    '/pages/dynamic-page.html',
    '/portfolio/',
    '/portfolio/index.html',
    '/portfolio/pages/dynamic-page.html',
];

document.addEventListener('DOMContentLoaded', () => {
    // Reload the page if the user clicks the back button and clear the cache
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    // Get the current pathname and query string of the URL
    const currentPathname = window.location.pathname.toLowerCase();
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Check if the user is on one of the allowed pages
    let isAllowed = allowedPaths.includes(currentPathname);

    // Set the PROD flag based on the current hostname
    PROD = currentPathname.includes('portfolio');

    // Set the prefix path based on the PROD flag
    const prefixPath = PROD ? '/Portfolio' : '';

    const prefixPathLower = prefixPath.toLowerCase();

    // Redirect to the appropriate page based on the current pathname
    switch (currentPathname) {
        case prefixPathLower:
            console.log("Caso 1, redirect to index.html");
            redirectTo(prefixPath + '/index.html');
            break;
        case prefixPathLower + '/':
            console.log("Caso 1, redirect to index.html");
            redirectTo(prefixPath + '/index.html');
            break;
        case prefixPathLower + '/pages/about.html':
            redirectTo(prefixPath + '/pages/dynamic-page.html?category=about');
            break;
        case prefixPathLower + '/pages/dynamic-page.html':
            const allowedCategories = ['works', 'about', 'press', 'contacts'];
            const allowedSubcategories = ['video_art', 'installations', 'paintings'];
            const currentCategory = currentSearchParams.get('category');
            const currentSubcategory = currentSearchParams.get('subcategory');
            isAllowed = allowedCategories.includes(currentCategory) || allowedSubcategories.includes(currentSubcategory);
            break;
        case prefixPathLower + '/pages/contact.html':
            redirectTo(prefixPath + '/pages/dynamic-page.html?category=contacts');
            break;
        case prefixPathLower + '/pages/press.html':
            redirectTo(prefixPath + '/pages/dynamic-page.html?category=press');
            break;
    }

    // Redirect to the 404 page if the URL is not allowed and we are on 'dynamic-page.html'
    if (!isAllowed) {
        if (currentPathname === prefixPath + '/pages/dynamic-page.html') {
            load404Page();
        } else {
            redirectTo(prefixPath + '/pages/404.html');
        }
    }

    // Function to redirect to a new page
    function redirectTo(url) {
        window.location.href = url;
        isAllowed = true;
    }

    // Function to load the 404 page
    function load404Page() {
        $('#main-content').load('../pages/404.html');
    }
});