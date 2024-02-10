document.addEventListener('DOMContentLoaded', function () {
    // Funzione per ottenere il valore di un parametro di query dall'URL.
    function getQueryParam(param) {
        var queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }
    var contentToLoad = getQueryParam('content');

    // Mappa dei valori, il primo è il valore del parametro, il secondo è il file da caricare.
    var contentMap = {
        'cat1': '../pages/dynamic-content.html',
        'cat2': '../pages/dynamic-content.html',
        'cat3': '../pages/dynamic-content.html',
        'about': '../pages/about.html',
        'exhibitions': '../pages/exhibitions.html',
        'contact': '../pages/contact.html'
    };

    // Seleziona il contenuto da caricare basato sull'URL
    var contentUrl = contentMap[contentToLoad];

    if (contentUrl) {
        // Carica il contenuto dinamico
        $('#main-content').load(contentUrl, function (response, status, xhr) {
            if (status == "error") {
                console.log("Qualcosa è andato storto nel caricamento del contenuto: ", xhr.status, xhr.statusText);
            }
        });
    } else {
        console.log("Contenuto non trovato per il parametro: ", contentToLoad);
        // Se non è stato trovato alcun contenuto, carica la pagina di errore 404
        $('#main-content').load('../pages/404.html');
    }

    // Aggiungi la classe active al link corrente
    var currentLink = document.querySelector(`a[href$='${contentToLoad}']`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
});
