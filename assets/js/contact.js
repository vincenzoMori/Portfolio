var socialContainer = document.getElementById('social-container');

if (socialContainer) {
    usefulLinks.forEach(link => {
        if (link.type === linkType.SOCIAL) {
            var a = document.createElement('a');
            a.href = link.url;
            a.classList.add('fade-in-cascade');
            a.innerHTML = `<i class="${link.icon}"></i> ${link.title}`;
            socialContainer.appendChild(a);
        }
    });
}

function sendForm() {
    var form = document.getElementById('contact-form');
    var formData = new FormData(form);

    fetch('https://script.google.com/macros/s/AKfycbziqrcmvUjG4LgAYZCF5aUI8G5oL8zBB_QCsnW0vRXC7Ry91dPrzmfSKtQ7KkSEHJYo/exec', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
    })
        .then(response => {
            // Gestisci le risposte che non hanno uno status HTTP di 200 OK
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            alert('Messaggio inviato con successo!');
            form.reset();
        })
        .catch(error => {
            console.error('Errore nella fetch:', error);
            alert('C\'è stato un errore nell\'invio del messaggio. Ti preghiamo di riprovare.');
        });

}

document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    sendForm();
});
