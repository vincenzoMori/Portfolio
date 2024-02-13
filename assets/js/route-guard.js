// Set the production flag
var PROD = false;

// List of allowed paths
var allowedPaths = [
    '/index.html',
    '/pages/dynamic-page.html',
    '/Portfolio/',
    '/Portfolio/index.html',
    '/Portfolio/pages/dynamic-page.html',
];

document.addEventListener('DOMContentLoaded', () => {
    // Reload the page if the user clicks the back button and clear the cache
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    // Get the current pathname and query string of the URL
    const currentPathname = window.location.pathname;
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Check if the user is on one of the allowed pages
    let isAllowed = allowedPaths.includes(currentPathname);

    // Set the PROD flag based on the current hostname
    PROD = currentPathname.includes('Portfolio');
    console.log(currentPathname)


    // Set the prefix path based on the PROD flag
    const prefixPath = PROD ? '/Portfolio' : '';
    console.log(prefixPath)

    // Redirect to the appropriate page based on the current pathname
    switch (currentPathname) {
        case prefixPath + '/':
            console.log('Redirecting to index.html')
            redirectTo(prefixPath + '/index.html');
            break;
        case prefixPath + '/pages/about.html':
            console.log('Redirecting to the dynamic about page')
            redirectTo(prefixPath + '/pages/dynamic-page.html?content=about');
            break;
        case prefixPath + '/pages/dynamic-page.html':
            const allowedContents = ['cat1', 'cat2', 'cat3', 'about', 'exhibitions', 'contact'];
            const currentContent = currentSearchParams.get('content');
            isAllowed = isAllowed && allowedContents.includes(currentContent);
            break;
        case prefixPath + '/pages/contact.html':
            console.log('Redirecting to the dynamic contact page')
            redirectTo(prefixPath + '/pages/dynamic-page.html?content=contact');
            break;
        case prefixPath + '/pages/exhibitions.html':
            console.log('Redirecting to the dynamic exhibitions page')
            redirectTo(prefixPath + '/pages/dynamic-page.html?content=exhibitions');
            break;
    }

    // Redirect to the 404 page if the URL is not allowed and we are on 'dynamic-page.html'
    if (!isAllowed) {
        if (currentPathname === prefixPath + '/pages/dynamic-page.html') {
            load404Page();
        } else {
            redirectTo('../pages/404.html');
            makeBackHomeLinkVisible();
        }
    }

    // Function to redirect to a new page
    function redirectTo(url) {
        console.log('Redirecting to: ' + url);
        window.location.href = url;
        isAllowed = true;
    }

    // Function to load the 404 page
    function load404Page() {
        console.log('Loading 404 page');
        $('#main-content').load('../pages/404.html');
    }

    // Function to make the back-home link visible
    function makeBackHomeLinkVisible() {
        console.log('Making back-home link visible');
        const backHomeLink = document.getElementsByClassName('back-home').item(0);
        backHomeLink.style.setProperty('display', 'block', 'important');
    }
});