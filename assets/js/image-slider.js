var currentImageIdx = 0;
var media = [];
var mediaType = '';

var imageOpened = false;

var prevBlobUrl = '';
var currBlobUrl = '';
var nextBlobUrl = '';

var urlAppsScript = 'https://script.google.com/macros/s/AKfycbziqrcmvUjG4LgAYZCF5aUI8G5oL8zBB_QCsnW0vRXC7Ry91dPrzmfSKtQ7KkSEHJYo/exec'

function init() {
    window.changeImage = changeImage;
    fetchImages();

    window.handleArrowKeyPress = function (event) {
        // Use of guard clause to immediately return if the image is open or not
        if (imageOpened && event.key === 'Escape') {
            closeImageFullScreen();
            return;
        }

        // If the image is open and the user presses any key other than Escape, do nothing.
        if (imageOpened) return;

        if (media.length <= 1 || mediaType != "image") return;
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
    var abortController = new AbortController();
    addAbortController(abortController);

    showSpinner();
    fetch(`${GET_DATA}?category=${categorySelected}&subcategory=${subcategorySelected}`,
        { signal: abortController.signal })
        .then(response => response.json())
        .then(async response => {
            if (!response.data.length == 0) {
                media = response.data // Get the images based on the selected category
                mediaType = response.responseType;
                checkImage();  // Check if the image is selected from the URL
                await loadImages(currentImageIdx, 0);
                decreaseBtnsOpacity();
                afterFetch();
            } else {
                $('#main-content').load('../pages/404.html');
            }
        }).catch(_ => {
            if (isEmptyAbortControllers())  // Check if there is already a fetch in progress, otherwise load 404
                $('#main-content').load('../pages/404.html');

        }).finally(() => {
            removeAbortController(abortController);
            hideSpinner();
        });
}

function afterFetch() {
    var toShow = document.getElementById(mediaType == 'video' ? 'video-container' : 'slide-show');
    toShow.style.display = 'flex';
    var arrows = document.getElementsByClassName('arrow');
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].style.display = 'flex';
    }
}

function decreaseBtnsOpacity() {
    if (media.length === 1) {
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
        const operaIndex = media.findIndex(image => image.id == operaId);
        if (operaIndex !== -1) currentImageIdx = operaIndex;
    }
}

async function loadImages(index, direction = 0) {
    window.currentImageIdx = index;
    if (mediaType != 'video') {
        if (direction === 0) {
            const [currBlobUrlInternal, nextBlobUrlInternal, prevBlobUrlInternal] = await Promise.all([
                loadImageBlob(index),
                loadImageBlob(index + 1 > media.length - 1 ? 0 : index + 1),
                loadImageBlob(index === 0 ? media.length - 1 : index - 1)
            ]);
            currBlobUrl = currBlobUrlInternal;
            nextBlobUrl = nextBlobUrlInternal;
            prevBlobUrl = prevBlobUrlInternal;
        }
        if (direction === 1) {
            URL.revokeObjectURL(prevBlobUrl);
            prevBlobUrl = currBlobUrl;
            currBlobUrl = nextBlobUrl;
            nextBlobUrl = await loadImageBlob(index + 1 > media.length - 1 ? 0 : index + 1);
        }
        if (direction === -1) {
            URL.revokeObjectURL(nextBlobUrl);
            nextBlobUrl = currBlobUrl;
            currBlobUrl = prevBlobUrl;
            prevBlobUrl = await loadImageBlob(index - 1 < 0 ? media.length - 1 : index - 1);
        }
    }

    createInfoPanel();
    setImageInfo();
}

function setImageInfo() {
    try {
        var toShow = document.getElementById(mediaType == 'video' ? 'video-container' : 'slide-show');
        // fade out the current image and fade in the next image with jQuery
        $(toShow).fadeOut(100, function () {
            if (mediaType === 'video') {
                let sourceVideo = document.getElementById('my-video');
                let tagVideo = document.getElementById('video-tag');
                sourceVideo.src = media[currentImageIdx].media[0].url;
                tagVideo.load();
            } else {
                toShow.style.backgroundImage = `url('${currBlobUrl}')`;
            }
            $(toShow).fadeIn(100);
        });

        const operaNumber = document.getElementsByClassName('opera-number').item(0);
        operaNumber.innerHTML = `${currentImageIdx + 1} / ${media.length}`;

        const imageTitle = document.getElementsByClassName('opera-title').item(0);
        imageTitle.innerHTML = media[currentImageIdx].titolo;

        const imageDescription = document.getElementsByClassName('opera-description').item(0);
        imageDescription.innerHTML = media[currentImageIdx].descrizione;

        const imageTechnique = document.getElementsByClassName('opera-technique').item(0);
        imageTechnique.innerHTML = media[currentImageIdx].tecnica.replace(/,/g, "<br>");

        const imageSizes = document.getElementsByClassName('opera-sizes').item(0);
        imageSizes.innerHTML = media[currentImageIdx].misure;

        const imageYear = document.getElementsByClassName('opera-year').item(0);
        imageYear.innerHTML = media[currentImageIdx].anno;

        history.pushState({}, null, `?category=${getCategoryUrl()}&subcategory=${getSubcategoryUrl()}&operaId=${media[currentImageIdx].id}`);
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
    currentImageIdx = (currentImageIdx + index + media.length) % media.length;
}

async function loadImageBlob(index) {
    try {
        const image = media[index];
        const response = await fetch(image.media[0].url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error while loading image:', error);
    }
}

window.toggleLike = function () {
    const likeBtn = document.getElementById('like-btn');
    const currentImage = media[currentImageIdx];
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

    const urlToFetch = `${urlAppsScript}/exec?id=${currentImage.id}&title=${encodeURIComponent(currentImage.titolo)}&token=${token}&action=${action}`;

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
    const currentImage = media[currentImageIdx];
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
    updateLikeButton(isLiked(media[currentImageIdx].id));
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
    <div id="details-title"> \
        <h4 class="opera-title">Test image</h4> \
        <p class="opera-number">1/3</p> \
    </div> \
        <div class="info-container"> \
            <p class="opera-description"></p> \
            <hr> \
            <p class="opera-technique"></p> \
            <p class="opera-sizes"></p>\
            <p class="opera-year"></p>\
        </div> \
        <div id="icons"> \
            <div class="img-change-btn" onclick="changeImage(-1)"> \
                <img class="arrow-mobile" src="../assets/media/svg/arrow-left.svg" alt="left-arrow"> \
            </div> \
            <img id="fullscreen-btn" src="../assets/media/svg/fullscreen.svg" alt="fullscreen-btn" onclick="displayImageFullScreen()"> \
            <img id="share-btn" src="../assets/media/svg/share.svg" alt="fullscreen-btn" onclick="shareImage()"> \
            <div class="img-change-btn" onclick="changeImage(1)"> \
                <img class="arrow-mobile" src="../assets/media/svg/arrow-right.svg" alt="right-arrow"> \
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

    if (mediaType === 'video') {
        document.getElementById('fullscreen-btn').style.display = 'none';
    }

    infoPanelRendered = true;
}

onMobileChange(() => {
    if (media.length > 0) {
        createInfoPanel();
        setImageInfo();
        decreaseBtnsOpacity();
    }
}, true);

init();