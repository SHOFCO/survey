function getUrlParameter(name) {
    var url = window.location.search;
    var results = new RegExp('[\\?&]' + name + '=([^&]*)').exec(url);
    if (!results) {
        return undefined;
    }
    return decodeURIComponent(results[1])
}

function last(arr) {
    return arr[arr.length - 1];
}

function csvUrl(keys, rows) {
    // TODO: this
    var csv = '';
    return 'data:text/csv;base64,' + btoa(csv);
}