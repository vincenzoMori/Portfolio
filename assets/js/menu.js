const currentPathname = window.location.pathname;
let path = currentPathname === '/Portfolio/index.html' ? './pages/dynamic-page.html?' : '../pages/dynamic-page.html?'

var linksHtml = `
        <ul>
            <li><a href="${path}content=cat1" class="dynamic-load">2010 - 2015</a></li>
            <li><a href="${path}content=cat2" class="dynamic-load">2016 - 2020</a></li>
            <li><a href="${path}content=cat3" class="dynamic-load">2021 - now</a></li>
            <br>
            <li><a href="${path}content=about" class="dynamic-load">about</a></li>
            <li><a href="${path}content=exhibitions" class="dynamic-load">exhibitions</a></li>
            <li><a href="${path}content=contact" class="dynamic-load">contact</a></li>
        </ul>
    `;
var menuContainer = document.getElementById('menu-container');
if (menuContainer) {
    menuContainer.innerHTML = linksHtml;
}