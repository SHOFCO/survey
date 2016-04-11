// Marker object for skipped questions.
function Skipped(reason) {
    this.reason = reason;
}

if (device.platform != 'browser') {
	window.onerror = function(msg, url, linenumber) {
	    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
	    return true;
	};
}

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

function csvEscape(value) {
    if (value === null) {
        return "";
    }
    if (value.reason) {
        value = 'Skipped: ' + value.reason;
    }
    value = value + "";
    return '"' + value.replace('\\', '\\\\').replace('"', '\\"') + '"';
}

function csv(rows) {
    var out = [];
    var columnNames = rows[0][0];

    var line = [];
    for (var i = 0; i < columnNames.length; i++) {
        line.push(csvEscape(columnNames[i]));
    }
    out.push(line.join(','));

    for (var i = 0; i < rows.length; i++) {
        line = [];
        var values = rows[i][1];
        for (var j = 0; j < values.length; j++) {
            line.push(csvEscape(values[j]));
        }
        out.push(line.join(','));
    }

    return out.join('\n');
}


function csvUrl(rows) {
    return 'data:text/csv;base64,' + btoa(csv(rows));
}