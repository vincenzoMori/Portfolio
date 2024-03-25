var linkSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
    </svg>
`;

function init() {
    const categorySelected = getCategoryUrl();
    var abortController = new AbortController();
    addAbortController(abortController);

    showSpinner();
    fetch(`${GET_DATA}?category=${categorySelected}`, { signal: abortController.signal })
        .then(response => response.json())
        .then(response => {
            if (!response.data.length == 0) {
                handleData(response.data);
            } else {
                handleData(response.data, true);
            }
        }).catch(_ => {
            if (isEmptyAbortControllers())  // Check if there is a fetch in progress, otherwise load 404
                $('#main-content').load('../pages/404.html');
        }).finally(() => {
            removeAbortController(abortController);
            hideSpinner();
        });
}

function handleData(data, voidData) {

    var pressContainer = document.getElementById('press-container');
    if (pressContainer && !voidData) {
        data.forEach(press => {
            var pressItem = document.createElement('div'); // Create a div for each press item
            pressItem.classList.add('press-item');

            var pressTitleDiv = document.createElement('a'); // Create a div for the title and the link icon
            pressTitleDiv.classList.add('press-title-div');
            pressTitleDiv.href = press.url;
            pressTitleDiv.target = '_blank';

            var pressImageUrl = document.createElement('div'); // Create a div for the link icon
            pressImageUrl.classList.add('press-image-icon');
            pressImageUrl.innerHTML = linkSvg;

            var pressTitle = document.createElement('p'); // Create a p for the title
            pressTitle.classList.add('press-title');
            pressTitle.innerHTML = press.anteprima;

            var pressDescription = document.createElement('p'); // Create a paragraph for the description
            pressDescription.classList.add('press-description');
            pressDescription.innerHTML = press.descrizione;

            pressTitleDiv.appendChild(pressImageUrl);
            pressTitleDiv.appendChild(pressTitle);
            pressItem.appendChild(pressTitleDiv);
            pressItem.appendChild(pressDescription);
            pressContainer.appendChild(pressItem);
        })
    } else {
        pressContainer.innerHTML = '<p>No press available</p>';
    }
}

init();