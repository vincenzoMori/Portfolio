// Function to get the value of a query parameter from the URL.
function getQueryParam(param) {
    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
}

document.addEventListener('DOMContentLoaded', function () {
    var contentToLoad = getQueryParam('content');

    // Map of values, where the key is the parameter value and the value is the file to load.
    var contentMap = {
        'cat1': '../pages/dynamic-content.html',
        'cat2': '../pages/dynamic-content.html',
        'cat3': '../pages/dynamic-content.html',
        'about': '../pages/about.html',
        'exhibitions': '../pages/exhibitions.html',
        'contact': '../pages/contact.html'
    };

    // Select the content to load based on the URL parameter.
    var contentUrl = contentMap[contentToLoad];

    if (contentUrl) {
        // Load the dynamic content.
        $('#main-content').load(contentUrl, function (response, status, xhr) {
            if (status == "error") {
                console.log("Something went wrong while loading the content: ", xhr.status, xhr.statusText);
            }
        });
    } else {
        console.log("Content not found for parameter: ", contentToLoad);
        // If no content is found, load the 404 error page.
        $('#main-content').load('../pages/404.html');
    }

    // Add the 'active' class to the current link.
    var currentLink = document.querySelector(`a[href$='${contentToLoad}']`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
});
