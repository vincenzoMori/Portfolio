const images = [
    '../assets/img/first.webp',
    '../assets/img/second.webp',
    '../assets/img/third.webp',
    '../assets/img/fourth.webp',
    '../assets/img/fifth.webp',
    '../assets/img/sixth.webp',
    '../assets/img/seventh.webp',
    '../assets/img/eighth.webp',
];

//fai un json in cui contieni path dell'immagine, descrizione, titolo, autore ecc

let currentImageIdx = 0;

function changeImage(direction) {
    console.log(direction);
    currentImageIdx += direction;

    if (currentImageIdx < 0) {
        currentImageIdx = images.length - 1;
    } else if (currentImageIdx > images.length - 1) {
        currentImageIdx = 0;
    }

    const imageSlider = document.getElementsByClassName('image-slider').item(0);

    imageSlider.style.backgroundImage = `url('${images[currentImageIdx]}')`;
}

// Rendiamo le funzioni accessibili globalmente
window.changeImage = changeImage;
