var currentImageIdx = 0;
var images = [];
var imageOpened = false;

var prevBlobUrl = '';
var currBlobUrl = '';
var nextBlobUrl = '';

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
    const categorySelected = getQueryParam('subcategory');
    fetch('../assets/json/images.json')
        .then(response => response.json())
        .then(data => {
            images = data[categorySelected];; // Get the images based on the selected category
            checkImage();  // Check if the image is selected from the URL
            loadImages(currentImageIdx, 0);
        });
}

function checkImage() {
    const operaQueryParam = getQueryParam('opera') || window.opera;
    if (operaQueryParam) {
        const operaTitle = operaQueryParam.replace(/_/g, ' ');
        const operaIndex = images.findIndex(image => image.title.toLowerCase() === operaTitle.toLowerCase());
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
    setImageInfo();
}

function setImageInfo() {
    try {
        console.log('Setting image info');
        const slide_show = document.getElementById('slide-show');
        slide_show.style.backgroundImage = `url('${currBlobUrl}')`;
        const operaNumber = document.getElementsByClassName('opera-number').item(0);
        operaNumber.innerHTML = `${currentImageIdx + 1} / ${images.length}`;
        const imageTitle = document.getElementsByClassName('opera-title').item(0);
        imageTitle.innerHTML = images[currentImageIdx].title;
        const imageDescription = document.getElementsByClassName('opera-description').item(0);
        imageDescription.innerHTML = images[currentImageIdx].description;
        const imageinfo = document.getElementsByClassName('opera-info').item(0);
        imageinfo.innerHTML = images[currentImageIdx].info;
        history.pushState({}, null, `?category=${getQueryParam('category')}&subcategory=${getQueryParam('subcategory')}&opera=${images[currentImageIdx].title.replace(/ /g, '_')}`);
        checkLikeBtn();
    } catch (error) {
        console.log('Error while setting image info' + error)
        $('#main-content').load('../pages/404.html');
    }
}

async function changeImage(direction) {
    setCurrentIndex(direction);
    await loadImages(currentImageIdx, direction);
}


function setCurrentIndex(index) {
    currentImageIdx = (currentImageIdx + index + images.length) % images.length;
}

async function loadImageBlob(index) {
    const image = images[index];
    const response = await fetch(image.imgPath);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

// Function to like an image
window.likeImage = function () {
    const currentImage = images[currentImageIdx];

    // Early exit if the image is already liked
    if (isLiked(currentImage.id)) return;

    updateLikeButton(true);

    // Assuming success, optimistically add the image to the local storage
    updateLikedImages(currentImage.id, true);

    // Construct fetch URL
    const urlToFetch = `https://script.google.com/macros/s/AKfycbziqrcmvUjG4LgAYZCF5aUI8G5oL8zBB_QCsnW0vRXC7Ry91dPrzmfSKtQ7KkSEHJYo/exec?id=${currentImage.id}&titolo=${currentImage.title}`;

    // Fetch request to the server for liking the image
    fetch(urlToFetch)
        .then(response => {
            if (!response.ok) {
                // If the request failed, remove the image from local storage
                updateLikedImages(currentImage.id, false);
                updateLikeButton(false); // Revert the like button to its original state
                throw new Error(`Server responded with status: ${response.status}`);
            }
        })
        .catch(error => {
            // Log the error for debugging purposes
            updateLikedImages(currentImage.id, false);
            updateLikeButton(false); // Revert the like button to its original state
            console.error('Error while liking the image:', error);
        });
}

window.shareImage = function () {
    const currentImage = images[currentImageIdx];
    const shareData = {
        title: currentImage.title,
        text: currentImage.description,
        url: window.location.href,
    };
    navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
}

function isLiked(id) {
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
    return likedImages.includes(id);
}

function updateLikeButton(isLiked) {

    const likeBtn = document.getElementById('like-btn');

    likeBtn.style.color = isLiked ? 'darkred' : 'black';
    likeBtn.classList.toggle('fa-regular', !isLiked);
    likeBtn.classList.toggle('fa-solid', isLiked);
    likeBtn.classList.toggle('already-liked', isLiked);
}

function checkLikeBtn() {
    updateLikeButton(isLiked(images[currentImageIdx].id));
}

// Helper function to update local storage with liked images
function updateLikedImages(id, add) {
    const storageKey = 'likedImages';
    const likedImages = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (add) {
        likedImages.push(id);
    } else {
        const index = likedImages.indexOf(id);
        if (index > -1) {
            likedImages.splice(index, 1);
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(likedImages));
}

// Function to display the image in full screen
window.displayImageFullScreen = function () {
    imageOpened = true;
    document.getElementById('fullscreen-img').src = currBlobUrl;
    document.getElementById('overlay').style.display = 'flex';
}

// Function to close the full screen image overlay
window.closeImageFullScreen = function (event) {
    imageOpened = false;
    if (event) {
        event.stopPropagation();
    }
    document.getElementById('overlay').style.display = 'none';
    document.removeEventListener('overlay', handleArrowKeyPress);
}

// Function to prevent click on the image from closing the overlay
window.stopPropagation = function (event) {
    event.stopPropagation();
}

// Event listener for closing the overlay when clicking outside the image
document.getElementById('overlay').addEventListener('click', function (event) {
    if (event.target.id === 'overlay') {
        closeImageFullScreen();
    }
});



var detailsPanel = ' \
    <div id="details" class="fade-in-cascade"> \
        <div> \
            <div id="details-title"> \
                <h4 class="opera-title">Test image</h4> \
                <p class="opera-number">1/3</p> \
            </div> \
            <p class="opera-description"></p> \
            <p class="opera-info"></p> \
        </div> \
        <div id="icons"> \
        <div class="img-change-btn" style="transform: rotate(180deg );" onclick="changeImage(-1)"> \
        <i class="fa-solid fa-arrow-right"></i> \
    </div> \
            <i id="fullscreen-btn" class="fa-solid fa-expand" onclick="displayImageFullScreen()"></i> \
            <i id="like-btn" class="fa-regular fa-heart" onclick="likeImage()"></i> \
            <i id="share-btn" class="fa-regular fa-share-from-square" onclick="shareImage()"></i> \
            <div class="img-change-btn" onclick="changeImage(1)"> \
            <i class="fa-solid fa-arrow-right"></i>  \
        </div> \
        </div> \
    </div> \
'


var infoPanelRendered = false;
function createInfoPanel() {
    const infoPanel = document.createElement('div');
    infoPanel.style.height = '100%';
    if (window.isMobile) {
        if (infoPanelRendered)
            document.getElementById('opera-info-container').innerHTML = '';
        infoPanel.innerHTML = detailsPanel;
        console.log('appending info panel');
        document.getElementById('opera-info-container-mobile').appendChild(infoPanel);
        infoPanelRendered = true;
    } else {
        if (infoPanelRendered)
            document.getElementById('opera-info-container-mobile').innerHTML = '';
        infoPanel.innerHTML = detailsPanel;
        document.getElementById('opera-info-container').appendChild(infoPanel);
        infoPanelRendered = true;
    }
}

init();
createInfoPanel();
onMobileChange(() => {
    console.log('creating info panel');
    createInfoPanel();
    setImageInfo();
});
