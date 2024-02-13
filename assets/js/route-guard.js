document.addEventListener('DOMContentLoaded', () => {
    // Reload the page if the user clicks the back button and clear the cache
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };

    // List of allowed paths
    const allowedPaths = [
        '/index.html',
        '/pages/dynamic-page.html',
        '/Portfolio/',
        '/Portfolio/index.html',
        '/Portfolio/pages/dynamic-page.html',
    ];

    // Get the current pathname and query string of the URL
    const currentPathname = window.location.pathname;
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Check if the user is on one of the allowed pages
    let isAllowed = allowedPaths.includes(currentPathname);

    console.log(currentPathname)

    // If on '/Portfolio/', redirect to '/Portfolio/index.html'
    if (currentPathname === '/Portfolio/') {
        console.log('Portfolio test')
        window.location.href = '/Portfolio/index.html';
        return
    }

    // If on './pages/about.html', redirect to './dynamic-page.html?content=about'
    if (currentPathname === '/pages/about.html') {
        console.log('Pages about test')
        window.location.href = './dynamic-page.html?content=about';
        return
    }


    // If on 'dynamic-page.html', check for allowed query parameters
    if (currentPathname === './pages/dynamic-page.html') {
        console.log('dynamic-page test')
        const allowedContents = ['cat1', 'cat2', 'cat3', 'about', 'exhibitions', 'contact'];
        const currentContent = currentSearchParams.get('content');
        isAllowed = isAllowed && allowedContents.includes(currentContent);
    }

    console.log(isAllowed)
    // Redirect to 404 page if the URL is not allowed and we are on 'dynamic-page.html'
    if (!isAllowed) {
        if (currentPathname === './pages/dynamic-page.html') {
            console.log('if 1')
            $('#main-content').load('../pages/404.html');
        } else {
            console.log('else 1')
            window.location.href = '../pages/404.html';
            // Make the <a> tag with class "back-home" visible using the display CSS property with the Web APIs
            console.log(document.getElementsByClassName('back-home'))
            document.getElementsByClassName('back-home').item(0).style.setProperty('display', 'block', 'important');
        }
    }
});
