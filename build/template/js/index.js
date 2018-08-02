if(typeof window.__login__ !== 'undefined'){
    window.__login__.anonymous={{anonymous}};
    if({{anonymous}}===false && !window.__login__ .userSessionIsValid()) {
        window.location.href = "login.html";
    }
} else {
    window.location.href = "login.html";
}
