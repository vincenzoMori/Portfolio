const currentPathname = window.location.pathname;
let basePath = currentPathname === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'

const links = [
    { href: 'cat1', text: '2010 - 2015' },
    { href: 'cat2', text: '2016 - 2020' },
    { href: 'cat3', text: '2021 - now' },
    { href: 'spacer', text: ''},
    { href: 'about', text: 'about' },
    { href: 'exhibitions', text: 'exhibitions' },
    { href: 'contact', text: 'contact' }
];

var menuContainer = document.getElementById('menu-container');
if (menuContainer) {
    links.forEach(link => {
        if (link.href === 'spacer') {
            var spacer = document.createElement('div');
            spacer.classList.add('spacer');
            menuContainer.appendChild(spacer);
            return;
        }
        var a = document.createElement('a');
        a.href = basePath + 'content=' + link.href;
        a.classList.add('bigLink');
        a.innerHTML = link.text;
        menuContainer.appendChild(a);
    });
}