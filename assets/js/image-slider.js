let currentImageIdx = 0;
let images = [];
let imageOpened = false;

let prevBlobUrl = '';
let currBlobUrl = '';
let nextBlobUrl = '';

document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(param) {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }

    async function changeImage(direction) {
        setCurrentIndex(direction);
        await loadImages(currentImageIdx, direction);
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

    function checkImage() {
        const operaQueryParam = getQueryParam('opera');
        if (operaQueryParam) {
            const operaTitle = operaQueryParam.replace(/_/g, ' ');
            const operaIndex = images.findIndex(image => image.title.toLowerCase() === operaTitle.toLowerCase());
            if (operaIndex !== -1) currentImageIdx = operaIndex;
        }
    }

    function setImageInfo() {
        try {
            const slide_show = document.getElementById('slide-show');
            slide_show.style.backgroundImage = `url('${currBlobUrl}')`;
            const imageTitle = document.getElementsByClassName('opera-title').item(0);
            imageTitle.innerHTML = images[currentImageIdx].title;
            const imageDescription = document.getElementsByClassName('opera-description').item(0);
            imageDescription.innerHTML = images[currentImageIdx].description;
            const imageinfo = document.getElementsByClassName('opera-info').item(0);
            imageinfo.innerHTML = images[currentImageIdx].info;
            history.pushState({}, null, `?content=${getQueryParam('content')}&opera=${images[currentImageIdx].title.replace(/ /g, '_')}`);
            const btn = document.getElementById('fullscreen-btn');
            btn.style.display = 'block'
        } catch {
            location.reload();
        }
    }

    function fetchImages() {
        const categorySelected = getQueryParam('content');
        fetch('../assets/json/images.json')
            .then(response => response.json())
            .then(data => {
                images = data[categorySelected];; // Get the images based on the selected category
                checkImage();  // Check if the image is selected from the URL
                loadImages(currentImageIdx, 0);
            });
    }

    async function loadImages(index, direction = 0) {
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

    function setCurrentIndex(index) {
        currentImageIdx = (currentImageIdx + index + images.length) % images.length;
    }

    async function loadImageBlob(index) {
        const image = images[index];
        const response = await fetch(image.imgPath);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    if (getQueryParam('content') !== 'cat1' && getQueryParam('content') !== 'cat2' && getQueryParam('content') !== 'cat3') {
        return;
    } else {
        window.changeImage = changeImage;
        fetchImages();
    }

    document.addEventListener('keydown', handleArrowKeyPress);
});

// Function to display the image in full screen
window.displayImageFullScreen = function () {
    imageOpened = true;
    document.getElementById('fullscreen-img').src = currBlobUrl;
    document.getElementById('overlay').style.display = 'flex';
    // Add event listener for ESC key press only when the overlay is visible
    document.addEventListener('keydown', handleArrowKeyPress);
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
