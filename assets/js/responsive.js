let mobileCallbacks = [];

const mql = window.matchMedia("(max-width: 768px)");
mql.addEventListener("change", () => {
    if (mql.matches) {
        window.isMobile = true;
    } else {
        window.isMobile = false;
    }

    mobileCallbacks.forEach(callback => {
        callback();
    });
});

if (mql.matches) {
    window.isMobile = true;
} else {
    window.isMobile = false;
}

function onMobileChange(callback) {
    mobileCallbacks.push(callback);
    console.log("registering callback " + callback);
}

function callMobileCallbacks() {
    mobileCallbacks.forEach(callback => {
        console.log("calling callback " + callback);
        callback();
    });
}