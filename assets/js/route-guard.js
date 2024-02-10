document.addEventListener('DOMContentLoaded', () => {
    // Lista dei path consentiti
    const allowedPaths = [
        '/index.html',
        '/pages/dynamic-page.html'
    ];

    // Ottieni il pathname e la stringa di query dell'URL attuale
    const currentPathname = window.location.pathname;
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Verifica se l'utente è in una delle pagine consentite
    let isAllowed = allowedPaths.includes(currentPathname);

    // Se in 'dynamic-page.html', verifica i parametri di query consentiti
    if (currentPathname === '/pages/dynamic-page.html') {
        const allowedContents = ['cat1', 'cat2', 'cat3', 'about', 'exhibitions', 'contact'];
        const currentContent = currentSearchParams.get('content');
        isAllowed = isAllowed && allowedContents.includes(currentContent);
    }

    // Reindirizza a pagina 404 se l'URL non è consentito e ci troviamo sulla pagina 'dynamic-page.html'
    if (!isAllowed) {
        if (currentPathname === '/pages/dynamic-page.html') {
            $('#main-content').load('../pages/404.html');
        } else {
            window.location.href = '../pages/404.html';
            // Rendo visibile il tag <a> per tornare alla pagina principale con classe "back-home" con il css display con le webApi
            document.getElementsByClassName('back-home').item(0).style.setProperty('display', 'block', 'important');
        }
    }
});
