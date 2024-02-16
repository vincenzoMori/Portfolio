document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const links = document.querySelectorAll('a'); // Select all links inside <li> elements
    const image = document.querySelector('.sidebar-header a'); // Select the logo image

    function handleClick(e, target) {
        e.preventDefault(); // Prevent default navigation action
        let newLocation = target.href; // Get the new URL to visit

        document.body.classList.add('fade-out'); // Add the class that triggers the animation

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
});
