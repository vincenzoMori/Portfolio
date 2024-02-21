var socialContainer = document.getElementById('social-container');

if (socialContainer) {
    usefulLinks
        .filter(link => link.type === linkType.SOCIAL)
        .forEach(link => {
            var a = document.createElement('a');
            a.target = '_blank';
            a.classList.add('social-btn', 'fade-in-cascade');
            a.href = link.url;
            a.innerHTML = `<i class="${link.icon}"></i> ${link.title}`;
            socialContainer.appendChild(a);
        });
}

function sendForm() {
    var sendButton = document.getElementById('send-btn');
    sendButton.disabled = true;
    sendButton.innerHTML = 'Sending...';
    sendButton.classList.remove('sent', 'error');

    var form = document.getElementById('contact-form');
    var formData = new FormData(form);

    fetch('https://script.google.com/macros/s/AKfycbziqrcmvUjG4LgAYZCF5aUI8G5oL8zBB_QCsnW0vRXC7Ry91dPrzmfSKtQ7KkSEHJYo/exec', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            form.reset();
            sendButton.innerHTML = 'Sent! Thank you :)';
            sendButton.disabled = false;
            sendButton.classList.add('sent');

        })
        .catch(error => {
            sendButton.innerHTML = 'Error! Please try again';
            sendButton.disabled = false;
            sendButton.classList.add('error');
            console.error('Errore nella fetch:', error);
        });

}

document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    sendForm();
});