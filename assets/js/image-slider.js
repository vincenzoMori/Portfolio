let currentImageIdx = 0;
let images = [];
let currentImage = '';
let imageOpened = false;

document.addEventListener('DOMContentLoaded', function () {

    function getQueryParam(param) {
        var queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }

    function changeImage(direction) {
        currentImageIdx += direction;

        if (currentImageIdx < 0) {
            currentImageIdx = images.length - 1;
        } else if (currentImageIdx > images.length - 1) {
            currentImageIdx = 0;
        }
        setImageInfo();
    }

    window.handleArrowKeyPress = function (event) {
        if (event.key === "ArrowRight" || event.keyCode === 39) {
            if (imageOpened) return;
            changeImage(1);
        } else if (event.key === "ArrowLeft" || event.keyCode === 37) {
            if (imageOpened) return;
            changeImage(-1);
        } else if (event.key === "Escape" || event.keyCode === 27) {
            if (!imageOpened) return;
            closeImageFullScreen();
        }

    }

    function checkImage() {
        var operaQueryParam = getQueryParam('opera');
        if (operaQueryParam) {
            var operaTitle = operaQueryParam.replace(/_/g, ' ');
            var operaIndex = images.findIndex(image => image.title == operaTitle);
            if (operaIndex !== -1) currentImageIdx = operaIndex;
        }
    }

    function setImageInfo() {
        try {
            currentImage = images[currentImageIdx]
            let slide_show = document.getElementById('slide-show');
            slide_show.style.backgroundImage = `url('${currentImage.imgPath}')`;
            let imageTitle = document.getElementsByClassName('opera-title').item(0);
            imageTitle.innerHTML = images[currentImageIdx].title;
            let imageDescription = document.getElementsByClassName('opera-description').item(0);
            imageDescription.innerHTML = images[currentImageIdx].description;
            let imageinfo = document.getElementsByClassName('opera-info').item(0);
            imageinfo.innerHTML = images[currentImageIdx].info;
            history.pushState({}, null, `?content=${getQueryParam('content')}&opera=${images[currentImageIdx].title.replace(/ /g, '_')}`);
            let btn = document.getElementById('fullscreen-btn');
            btn.style.display = 'block'
        } catch {
            // Reload the page
            location.reload();
        }
    }

    function fetchImages() {
        var categorySelected = getQueryParam('content'); // Get the value of the 'content' parameter.
        // Fetch images.json
        fetch('../assets/json/images.json')
            .then(response => response.json())
            .then(data => {
                images = data[categorySelected]; // Get the images based on the selected category
                checkImage();
                setImageInfo();
            });
    }

    // Execute the image slider controls and setup only for category pages
    if (getQueryParam('content') != 'cat1' && getQueryParam('content') != 'cat2' && getQueryParam('content') != 'cat3') {
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
    var imagePath = currentImage.imgPath;
    document.getElementById('fullscreen-img').src = imagePath;
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

    // Remove event listener for ESC key press when the overlay is closed
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

