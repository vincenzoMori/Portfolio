let mobileCallbacks = [];

const mql = window.matchMedia("(max-width: 768px)");
mql.addEventListener("change", () => {
    if (mql.matches) {
        window.isMobile = true;
    } else {
        window.isMobile = false;
    }

    mobileCallbacks.forEach(obj => {
        obj.callback();
    });
});

function cleanUpMobileCallbacks() {
    mobileCallbacks = mobileCallbacks.filter(obj => {
        if (obj.cleanUp) {
            return false;
        }
        return true;
    });
}

if (mql.matches) {
    window.isMobile = true;
} else {
    window.isMobile = false;
}

function onMobileChange(callback, cleanUp = false) {
    mobileCallbacks.push({
        callback,
        cleanUp
    });
}