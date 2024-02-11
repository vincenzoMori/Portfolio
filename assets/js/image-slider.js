// Funzione per ottenere il valore di un parametro di query dall'URL.
document.addEventListener('DOMContentLoaded', function () {

    let currentImageIdx = 0;
    let images = [];

    function getQueryParam(param) {
        var queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }

    //Effettuo i contorlli e settaggio per la navigazione tra le immagini solo per le pagine di categoria
    if (getQueryParam('content') != 'cat1' && getQueryParam('content') != 'cat2' && getQueryParam('content') != 'cat3') {
        return;
    } else {
        window.changeImage = function (direction) {
            currentImageIdx += direction;

            if (currentImageIdx < 0) {
                currentImageIdx = images.length - 1;
            } else if (currentImageIdx > images.length - 1) {
                currentImageIdx = 0;
            }
            setImageInfo();
        }

        var categorySelected = getQueryParam('content'); // Ottieni il valore del parametro 'content'.
        //Effettuo la get da images.json
        fetch('../assets/json/images.json')
            .then(response => response.json())
            .then(data => {
                images = data[categorySelected]; // Ottengo le immagini in base alla categoria selezionata
                checkImage();
                setImageInfo();
            });

        function checkImage() {
            var operaQueryParam = getQueryParam('opera');
            if (operaQueryParam) {
                var operaTitle = operaQueryParam.replace(/_/g, ' ');
                var operaIndex = images.findIndex(image => image.title == operaTitle);
                if (operaIndex !== -1) currentImageIdx = operaIndex;
            }
        }

        function setImageInfo() {
            console.log('setImageInfo')
            let imageSlider = document.getElementsByClassName('image-slider').item(0);
            imageSlider.style.backgroundImage = `url('${images[currentImageIdx].imgPath}')`;
            let imageTitle = document.getElementsByClassName('opera-title').item(0);
            imageTitle.innerHTML = images[currentImageIdx].title;
            let imageDescription = document.getElementsByClassName('opera-description').item(0);
            imageDescription.innerHTML = images[currentImageIdx].description;
            let imageinfo = document.getElementsByClassName('opera-info').item(0);
            imageinfo.innerHTML = images[currentImageIdx].info;
            history.pushState({}, null, `?content=${getQueryParam('content')}&opera=${images[currentImageIdx].title.replace(/ /g, '_')}`);
        }
    }
})