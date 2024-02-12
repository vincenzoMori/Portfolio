var linksHtml = `
        <ul>
            <li><a href="../Portfolio/pages/dynamic-page.html?content=cat1" class="dynamic-load">2010 - 2015</a></li>
            <li><a href="./pages/dynamic-page.html?content=cat2" class="dynamic-load">2016 - 2020</a></li>
            <li><a href="../pages/dynamic-page.html?content=cat3" class="dynamic-load">2021 - now</a></li>
            <br>
            <li><a href="../pages/dynamic-page.html?content=about" class="dynamic-load">about</a></li>
            <li><a href="../pages/dynamic-page.html?content=exhibitions" class="dynamic-load">exhibitions</a></li>
            <li><a href="../pages/dynamic-page.html?content=contact" class="dynamic-load">contact</a></li>
        </ul>
    `;
var menuContainer = document.getElementById('menu-container');
if (menuContainer) {
    menuContainer.innerHTML = linksHtml;
}