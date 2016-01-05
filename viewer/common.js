function getUrlParameter(name) {
    var url = window.location.search;
    var results = new RegExp('[\\?&]' + name + '=([^&]*)').exec(url);
    if (!results) {
        return undefined;
    }
    return decodeURIComponent(results[1])
}
