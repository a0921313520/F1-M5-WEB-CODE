if (!!window.ActiveXObject || "ActiveXObject" in window) {
    var script = document.createElement("script");
    script.src = "/vn/js/polyfill.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}
