document.addEventListener('DOMContentLoaded', function () {
    // Funzione per ottenere il valore di un parametro di query dall'URL.
    function getQueryParam(param) {
        var queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }

    var contentToLoad = getQueryParam('content'); // Ottieni il valore del parametro 'content'.
    var contentMap = {
        'cat1': '../pages/cat1.html', // Mappa dei valori, il primo è il valore del parametro, il secondo è il file da caricare.
        'cat2': '../pages/cat2.html',
        'cat3': '../pages/cat3.html',
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
        console.log("Caricamento del contenuto predefinito");
        $('#main-content').load(contentMap['cat1'], function (response, status, xhr) {
            if (status == "error") {
                console.log("Qualcosa è andato storto nel caricamento del contenuto: ", xhr.status, xhr.statusText);
            }
        });
    }
});
