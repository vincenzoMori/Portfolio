//funzione per prendere i parametri dall'url (sia visualizzato che passato come argomento)
function getQueryParam(param, url = null) {
    console.log("URL getQueryParam: ", url);
    if (url !== null) {
        console.log("URL getQueryParam: ", url);
        var urlObject = new URL(url);
        var queryParams = new URLSearchParams(urlObject.search);
        return queryParams.get(param);
    }

    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
}

// prendo i parametri dall'url
var categoryToLoad = getQueryParam('category');
var subcategoryToLoad = getQueryParam('subcategory');


//viene chiamata quando la pagina viene caricata
function loadPage() {

    //mi creo l'url del file da caricare
    var contentUrl = getFileFromParams(categoryToLoad, subcategoryToLoad);

    //se esiste
    if (contentUrl) {
        //carico il contenuto
        loadContent(contentUrl.url, { category: contentUrl.category, subcategory: contentUrl.subcategory });
    } else {
        //altrimenti carico la pagina 404
        console.log("Content not found 1");
        $('#main-content').load('../pages/404.html');
    }
}

//funzione per prendere il file da caricare in base ai parametri passati
function getFileFromParams(categoryToLoad, subcategoryToLoad = null) {

    //controllo se la categoria esiste nel file di configurazione
    //se esiste imposto categoryIndex con l'indice della categoria nel file di configurazione
    //se non esiste categoryIndex rimane -1
    const categoryIndex = routes.findIndex(item => {
        return item.href === categoryToLoad;
    });

    //controllo se la categoria è una categoria con sottocategorie
    //se è una categoria con sottocategorie e non è stata selezionata una sottocategoria
    //imposto subcategoryToLoad con la prima sottocategoria della categoria
    if (categoryIndex !== -1 && routes[categoryIndex].subcategories && !subcategoryToLoad) {
        console.log("category with subcategories but no subcategory selected");
        subcategoryToLoad = routes[categoryIndex].subcategories[0].href;
    }

    //se la categoria esiste
    if (categoryIndex !== -1) {
        //se la categoria ha sottocategorie
        if (routes[categoryIndex].subcategories && subcategoryToLoad) {
            //prendo il file della sottocategoria selezionata
            var contentUrl = routes[categoryIndex].subcategories.find(subcategory => {
                return subcategory.href === subcategoryToLoad;
            }).file;
        } else {
            //altrimenti prendo il file della categoria
            var contentUrl = routes[categoryIndex].file;
        }

        //ritorno l'url del file da caricare
        //vengono ritornati anche i parametri category e subcategory
        //(questo per settare l'active class e nel caso devo scegliere la sottocategoria)
        return {
            url: contentUrl,
            category: categoryToLoad,
            subcategory: subcategoryToLoad
        };
    }

    return null;
}

function loadContent(contentUrl, params) {

    //carico il contenuto
    if (contentUrl) {
        $('#main-content').load(contentUrl, function (response, status, xhr) {
            if (status == "error") {
                console.log("Something went wrong while loading the category: ", xhr.status, xhr.statusText);
            }
        });

    } else {
        console.log("Content not found 2");
       $('#main-content').load('../pages/404.html');
    }


    //setto l'active class
    if (params && params.subcategory) {
        var subcategoryLink = document.querySelector('.subcategory[href*="' + params.subcategory + '"]');
        setActive(subcategoryLink);
    } else {
        var categoryLink = document.querySelector('.category[href*="' + params.category + '"]');
        setActive(categoryLink);
    }
    //setto l'url della barra
    var newUrl = window.location.pathname + '?category=' + params.category;
    if (params.subcategory) {
        newUrl += '&subcategory=' + params.subcategory;
    }
    window.history.pushState({}, '', newUrl);
}

// event listener per il click sui link
document.addEventListener('DOMContentLoaded', function () {
    var menuLinks = document.querySelectorAll('.category, .subcategory');
    menuLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            // mi prendo l'url del link
            var linkClicked = event.target.href;
            
            //etrarre i parametri dall'url
            var category = getQueryParam('category', linkClicked);
            var subcategory = getQueryParam('subcategory', linkClicked);

            //prendo l'url del file da caricare
            var contentUrl = getFileFromParams(category, subcategory);

            //setto i parametri category e subcategory
            //se tutto va bene non cambiano
            //se la categoria ha sottocategorie e non è stata selezionata una sottocategoria
            //imposto subcategory con la prima sottocategoria della categoria
            category = contentUrl.category;
            subcategory = contentUrl.subcategory;

            //carico il contenuto
            loadContent(contentUrl.url, { category, subcategory });

        });
    });
});

loadPage();
