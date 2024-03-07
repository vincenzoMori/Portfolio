document.body.classList.add('fade-in');

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    window.handleClick = function (e, target) {
        e.preventDefault(); // Prevent default navigation action
        let newLocation = target.href; // Get the new URL to visit

        if (document.body.classList.contains('fade-in'))
            document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');

        // Wait for the animation to complete before changing the page
        document.body.addEventListener('animationend', () => {
            window.location.href = newLocation;
        }, { once: true }); // Use { once: true } to ensure the event listener is removed after use
    }

    eventListeners();
    fadeInCascade();
});

function fadeInCascade() {
    let elements = document.querySelectorAll('.fade-in-cascade');
    elements.forEach((element, index) => {
        element.style.animation = `fadeInAnimation 1s ease forwards ${index / 7 + 0.5}s`;
    });
}

function eventListeners() {
    const links = document.querySelectorAll('a'); // Select all links inside <li> elements
    var logoClassIdentifier = window.isMobile ? '.sidebar-mobile-content .header a' : '.sidebar-header a';
    const image = document.querySelector(logoClassIdentifier); // Select the logo image

    if (!image) {
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                handleClick(e, link);
            });
        });
    } else {
        image.addEventListener('click', (e) => {
            handleClick(e, image);
        });
    }
}

onMobileChange(() => {
    eventListeners();
    fadeInCascade();
});

