// Function to get the value of a query parameter from the URL.
function getQueryParam(param) {
    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
}

document.addEventListener('DOMContentLoaded', function () {
    var categoryToLoad = getQueryParam('category');
    var subcategoryToLoad = getQueryParam('subcategory');

    // Map of values, where the key is the parameter value and the value is the file to load.
    var switchMap = {
        'works/paintings': '../pages/dynamic-content.html',
        // 'works/video_art': '../pages/dynamic-content.html', // TODO: Uncomment this line when the video art page is ready
        // 'works/installations': '../pages/dynamic-content.html', // TODO: Uncomment this line when the installations page is ready
        'press': '../pages/press.html',
        'about': '../pages/about.html',
        'exhibitions': '../pages/exhibitions.html',
        'contacts': '../pages/contact.html'
    };

    // Select the content to load based on the URL parameter.
    var contentUrl = switchMap[
        subcategoryToLoad ? categoryToLoad + '/' + subcategoryToLoad : categoryToLoad
    ];

    if (contentUrl) {
        // Load the dynamic content.
        $('#main-content').load(contentUrl, function (response, status, xhr) {
            if (status == "error") {
                console.log("Something went wrong while loading the category: ", xhr.status, xhr.statusText);
            }
        });
    } else {
        console.log("Content not found for parameter: ", categoryToLoad);
        // If no content is found, load the 404 error page.
        $('#main-content').load('../pages/404.html');
    }

    // Add the 'active' class to the current link.
    var currentLink = document.querySelector(`a[href$='${categoryToLoad}']`);
    if (currentLink) {
        currentLink.classList.add('active');
    }

    // Add the 'active' class to the current subcategory link.
    var subcategoryToLoad = getQueryParam('subcategory');
    var currentSubcategoryLink = document.querySelector(`a[href$='${subcategoryToLoad}']`);
    if (currentSubcategoryLink) {
        currentSubcategoryLink.classList.add('active');
    }
});
