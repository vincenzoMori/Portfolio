var currentImageIdx = 0;
var images = [];
var imageOpened = false;

var prevBlobUrl = '';
var currBlobUrl = '';
var nextBlobUrl = '';

var urlGoogleSheet = 'https://script.google.com/macros/s/AKfycbziqrcmvUjG4LgAYZCF5aUI8G5oL8zBB_QCsnW0vRXC7Ry91dPrzmfSKtQ7KkSEHJYo/exec'

function init() {
    if (getQueryParam('subcategory') !== 'paintings') {
        return;
    } else {
        window.changeImage = changeImage;
        fetchImages();
    }

    window.handleArrowKeyPress = function (event) {
        // Use of guard clause to immediately return if the image is open or not
        if (imageOpened && event.key === 'Escape') {
            closeImageFullScreen();
            return;
        }

        // If the image is open and the user presses any key other than Escape, do nothing.
        if (imageOpened) return;

        if (images.length <= 1) return;
        // Navigation between images if the image is not open (imageOpened is false)
        if (event.key === 'ArrowRight') {
            changeImage(1);
        } else if (event.key === 'ArrowLeft') {
            changeImage(-1);
        }
    }

    // Event listener for arrow key press
    // Check if the event listener is already added to avoid adding it multiple times
    if (!window.hasEventListener) {
        document.addEventListener('keyup', handleArrowKeyPress);
        window.hasEventListener = true;
    }
}

function fetchImages() {
    const categorySelected = getCategoryUrl();
    const subcategorySelected = getSubcategoryUrl();

    fetch(`https://script.google.com/macros/s/AKfycbzlGrnhwyEe7Pa6Ra9B0QKoJVtkoZchk77n_bxLLmqMYYUf_SSZM9dcZpM6nBJ4jDVVtA/exec?category=${categorySelected}&subcategory=${subcategorySelected}`)
        .then(response => response.json())
        .then(async data => {
            if (!data.length == 0) {
                images = data // Get the images based on the selected category
                checkImage();  // Check if the image is selected from the URL
                await loadImages(currentImageIdx, 0);
                decreaseBtnsOpacity();
            } else {
                $('#main-content').load('../pages/404.html');
                return;
            }
        });
}

function decreaseBtnsOpacity() {
    if (images.length === 1) {
        let classe = window.isMobile ? 'img-change-btn' : 'arrow';
        let btns = document.getElementsByClassName(classe);
        for (let i = 0; i < btns.length; i++) {
            if (!btns[i].classList.contains('disabled'))
                btns[i].classList.add('disabled');
        }
    }
}

function checkImage() {
    const operaId = getQueryParam('operaId') || window.operaId;
    if (operaId) {
        const operaIndex = images.findIndex(image => image.id == operaId);
        if (operaIndex !== -1) currentImageIdx = operaIndex;
    }
}

async function loadImages(index, direction = 0) {
    window.currentImageIdx = index;
    if (direction === 0) {
        const [currBlobUrlInternal, nextBlobUrlInternal, prevBlobUrlInternal] = await Promise.all([
            loadImageBlob(index),
            loadImageBlob(index + 1 > images.length - 1 ? 0 : index + 1),
            loadImageBlob(index === 0 ? images.length - 1 : index - 1)
        ]);
        currBlobUrl = currBlobUrlInternal;
        nextBlobUrl = nextBlobUrlInternal;
        prevBlobUrl = prevBlobUrlInternal;
    }
    if (direction === 1) {
        URL.revokeObjectURL(prevBlobUrl);
        prevBlobUrl = currBlobUrl;
        currBlobUrl = nextBlobUrl;
        nextBlobUrl = await loadImageBlob(index + 1 > images.length - 1 ? 0 : index + 1);
    }
    if (direction === -1) {
        URL.revokeObjectURL(nextBlobUrl);
        nextBlobUrl = currBlobUrl;
        currBlobUrl = prevBlobUrl;
        prevBlobUrl = await loadImageBlob(index - 1 < 0 ? images.length - 1 : index - 1);
    }
    createInfoPanel();
    setImageInfo();
}

function setImageInfo() {
    try {
        const slide_show = document.getElementById('slide-show');

        // fade out the current image and fade in the next image with jQuery
        $(slide_show).fadeOut(100, function () {
            slide_show.style.backgroundImage = `url('${currBlobUrl}')`;
            $(slide_show).fadeIn(100);
        });

        const operaNumber = document.getElementsByClassName('opera-number').item(0);
        operaNumber.innerHTML = `${currentImageIdx + 1} / ${images.length}`;
        const imageTitle = document.getElementsByClassName('opera-title').item(0);
        imageTitle.innerHTML = images[currentImageIdx].titolo;
        const imageDescription = document.getElementsByClassName('opera-description').item(0);
        imageDescription.innerHTML = images[currentImageIdx].descrizione;
        const imageTechnique = document.getElementsByClassName('opera-technique').item(0);
        imageTechnique.innerHTML = images[currentImageIdx].tecnica.replace(/,/g, "<br>");
        history.pushState({}, null, `?category=${getCategoryUrl()}&subcategory=${getSubcategoryUrl()}&operaId=${images[currentImageIdx].id}`);
        // checkLikeBtn();
    } catch {
        console.log('Error while setting image info')
        $('#main-content').load('../pages/404.html');
    }
}

async function changeImage(direction) {
    if (navigator.vibrate)
        navigator.vibrate(50);

    setCurrentIndex(direction);
    await loadImages(currentImageIdx, direction);
}


function setCurrentIndex(index) {
    currentImageIdx = (currentImageIdx + index + images.length) % images.length;
}

async function loadImageBlob(index) {
    try {
        const image = images[index];
        const response = await fetch(image.immagini[0].url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error while loading image:', error);
    }
}

window.toggleLike = function () {
    const likeBtn = document.getElementById('like-btn');
    const currentImage = images[currentImageIdx];
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
    const imageEntry = likedImages.find(item => item.id === currentImage.id);

    likeBtn.classList.add('disabled');

    let action;
    let token;

    if (imageEntry) {
        action = 'remove';
        token = imageEntry.token;
    } else {
        action = 'add';
        token = generateUniqueToken();
    }

    updateLikeButton(action === 'add');
    updateLocalStorage(currentImage.id, token, action === 'add');

    const urlToFetch = `${urlGoogleSheet}/exec?id=${currentImage.id}&title=${encodeURIComponent(currentImage.titolo)}&token=${token}&action=${action}`;

    fetch(urlToFetch)
        .then(response => response.json())
        .then(result => {
            if (result.status !== 'success') {
                console.error('Error while toggling the like:', result);
                updateLocalStorage(currentImage.id, token, action === 'remove');
                updateLikeButton(action === 'remove');
            }
        })
        .catch(error => {
            console.error('Error while toggling the like:', error);
            updateLocalStorage(currentImage.id, token, action === 'remove');
            updateLikeButton(action === 'remove');
        })
        .finally(() => {
            likeBtn.classList.remove('disabled')
        });
}

function updateLocalStorage(id, token, add) {
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
    if (add) {
        likedImages.push({ id: id, token: token });
    } else {
        const index = likedImages.findIndex(item => item.id === id);
        if (index !== -1) {
            likedImages.splice(index, 1);
        }
    }
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
}

window.shareImage = function () {
    const currentImage = images[currentImageIdx];
    const shareData = {
        title: currentImage.titolo,
        text: currentImage.descrizione,
        url: window.location.href,
    };
    navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
}

function isLiked(id) {
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
    return likedImages.some(item => item.id === id);
}

function updateLikeButton(isLiked) {

    const likeBtn = document.getElementById('like-btn');

    likeBtn.style.color = isLiked ? 'darkred' : 'black';
    likeBtn.classList.toggle('fa-regular', !isLiked);
    likeBtn.classList.toggle('fa-solid', isLiked);
}

function checkLikeBtn() {
    updateLikeButton(isLiked(images[currentImageIdx].id));
}

// Helper function to update local storage with liked images
function updateLikedImages(id, add) {
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];

    if (add) {
        const token = generateUniqueToken();
        likedImages.push({ id, token });
    } else {
        const index = likedImages.findIndex(item => item.id === id);
        if (index !== -1) likedImages.splice(index, 1);
    }

    localStorage.setItem('likedImages', JSON.stringify(likedImages));
}

// Function to display the image in full screen
window.displayImageFullScreen = function () {
    imageOpened = true;
    document.getElementById('fullscreen-img').src = currBlobUrl;
    document.getElementById('overlay-fullscreen-img').style.display = 'flex';
}

// Function to close the full screen image overlay
window.closeImageFullScreen = function (event) {
    imageOpened = false;
    if (event) {
        event.stopPropagation();
    }
    document.getElementById('overlay-fullscreen-img').style.display = 'none';
    document.removeEventListener('overlay-fullscreen-img', handleArrowKeyPress);
}

// Function to prevent click on the image from closing the overlay
window.stopPropagation = function (event) {
    event.stopPropagation();
}

// Event listener for closing the overlay when clicking outside the image
document.getElementById('overlay-fullscreen-img').addEventListener('click', function (event) {
    if (event.target.id === 'overlay-fullscreen-img') {
        closeImageFullScreen();
    }
});

window.generateUniqueToken = function () {
    return Math.random().toString(36).substr(2, 9) + new Date().getTime() + Math.random().toString(36).substr(2, 9)
}

var detailsPanel = ' \
    <div id="details" class="fade-in-cascade"> \
        <div> \
            <div id="details-title"> \
                <h4 class="opera-title">Test image</h4> \
                <p class="opera-number">1/3</p> \
            </div> \
            <p class="opera-description"></p> \
            <p class="opera-technique"></p> \
        </div> \
        <div id="icons"> \
            <div class="img-change-btn" style="transform: rotate(180deg);" onclick="changeImage(-1)"> \
                <i class="fa-solid fa-arrow-right"></i> \
            </div> \
            <i id="fullscreen-btn" class="fa-solid fa-expand" onclick="displayImageFullScreen()"></i> \
            <i id="share-btn" class="fa-regular fa-share-from-square" onclick="shareImage()"></i> \
            <div class="img-change-btn" onclick="changeImage(1)"> \
                <i class="fa-solid fa-arrow-right"></i> \
            </div> \
        </div> \
    </div> \
'


var infoPanelRendered = false;
function createInfoPanel() {

    if (document.getElementById('info-panel'))
        document.getElementById('info-panel').remove();

    const infoPanel = document.createElement('div');
    infoPanel.id = 'info-panel';
    infoPanel.style.height = '100%';

    const operaInfoContainer = window.isMobile ? 'opera-info-container-mobile' : 'opera-info-container';
    const otherOperaInfoContainer = window.isMobile ? 'opera-info-container' : 'opera-info-container-mobile';

    if (infoPanelRendered) {
        document.getElementById(otherOperaInfoContainer).innerHTML = '';
    }

    infoPanel.innerHTML = detailsPanel;
    document.getElementById(operaInfoContainer).appendChild(infoPanel);
    infoPanelRendered = true;
}

onMobileChange(() => {
    createInfoPanel();
    setImageInfo();
    decreaseBtnsOpacity();
}, true);

init();