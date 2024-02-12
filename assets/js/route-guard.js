document.addEventListener('DOMContentLoaded', () => {
    // List of allowed paths
    const allowedPaths = [
        '/index.html',
        '/pages/dynamic-page.html'
    ];

    // Get the current pathname and query string of the URL
    const currentPathname = window.location.pathname;
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Check if the user is on one of the allowed pages
    let isAllowed = allowedPaths.includes(currentPathname);

    // If on 'dynamic-page.html', check for allowed query parameters
    if (currentPathname === '/pages/dynamic-page.html') {
        const allowedContents = ['cat1', 'cat2', 'cat3', 'about', 'exhibitions', 'contact'];
        const currentContent = currentSearchParams.get('content');
        isAllowed = isAllowed && allowedContents.includes(currentContent);
    }

    // Redirect to 404 page if the URL is not allowed and we are on 'dynamic-page.html'
    if (!isAllowed) {
        if (currentPathname === '/pages/dynamic-page.html') {
            $('#main-content').load('../pages/404.html');
        } else {
            window.location.href = '../pages/404.html';
            // Make the <a> tag with class "back-home" visible using the display CSS property with the Web APIs
            document.getElementsByClassName('back-home').item(0).style.setProperty('display', 'block', 'important');
        }
    }
});
