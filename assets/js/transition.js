document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    const links = document.querySelectorAll('li a'); // Seleziona tutti i link dentro gli elementi <li>
    const image = document.querySelector('.sidebar-header a'); // Seleziona l'immagine del logo

    function handleClick(e, target) {
        e.preventDefault(); // Previene l'azione di navigazione di default
        let newLocation = target.href; // Ottiene il nuovo URL da visitare
        console.log(newLocation)
        document.body.classList.add('fade-out'); // Aggiunge la classe che avvia l'animazione
        // Attende che l'animazione sia completa prima di cambiare la pagina
        document.body.addEventListener('animationend', () => {
            window.location.href = newLocation;
        }, { once: true }); // Usiamo { once: true } per assicurarci che l'event listener sia rimosso dopo l'uso
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
