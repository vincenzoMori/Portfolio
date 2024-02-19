document.body.classList.add('fade-in');

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const links = document.querySelectorAll('a'); // Select all links inside <li> elements
    const image = document.querySelector('.sidebar-header a'); // Select the logo image

    function handleClick(e, target) {
        e.preventDefault(); // Prevent default navigation action
        let newLocation = target.href; // Get the new URL to visit

        console.log('handleClick', newLocation);
        console.log('body', document.body.classList);

        if (document.body.classList.contains('fade-in'))
            document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');

        // Wait for the animation to complete before changing the page
        document.body.addEventListener('animationend', () => {
            window.location.href = newLocation;
        }, { once: true }); // Use { once: true } to ensure the event listener is removed after use
    }

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

    fadeInCascade();
});

function fadeInCascade() {
    console.log('fadeInCascade');
    let elements = document.querySelectorAll('.fade-in-cascade');
    elements.forEach((element, index) => {
        element.style.animation = `fadeInAnimation 1s ease forwards ${index / 7 + 0.5}s`;
    });
}

