// viewer.js

RENDER = {
    'yes/no': renderYesNo,
    'text': renderText,
    'signature': renderSignature,
    'checkboxes': renderCheckboxes,
    'random': renderRandom,
    'number': renderNumber,
    'options': renderOptions
}

$(document).ready(function() {
    $.getJSON('baseline-2016.json', function(pages) {
        render(pages);
    });
});

function render(pages) {
    for (var i = 0; i < pages.length; i++) {
        $(document.body).append(renderPage(pages[i]));
    }
}

function renderPage(page) {
    // TODO: remove this!
    console.log(page);

    var div = $('<div class="page">');
    div.append($('<h1>').text(page.title));
    if (page.static) {
        var paras = page.static.split(/\n\n+/);
        for (var i = 0; i < paras.length; i++) {
            div.append($('<div class="static">').text(paras[i]));
        }
    }
    if (page.questions) {
        for (var i = 0; i < page.questions.length; i++) {
            var q = page.questions[i];
            div.append(RENDER[q.type](q));
            
            if (q.subs) {
                for (var j = 0; j < q.subs.length; j++) {
                    var sub = q.subs[j];
                    div.append(RENDER[sub.type](sub));
                }
            }
        }
    }
    return div;
}

function renderYesNo(data) {
    var div = $('<div class="question yesNo">');
    div.append(renderLabel(data.label));
    div.append($('<input type="radio">'));
    div.append($('<label>').text('Yes'));
    div.append(' ');
    div.append($('<input type="radio">'));
    div.append($('<label>').text('No'));
    return div;
}

function renderText(data) {
    var div = $('<div class="question text">');
    div.append(renderLabel(data.label));
    div.append('TODO: text');
    return div;
}

function renderSignature(data) {
    var div = $('<div class="question signature">');
    div.append(renderLabel(data.label));
    div.append($('<a href="#">').text('Sign'));
    // TODO: PIN entry
    return div;
}

function renderCheckboxes(data) {
    var div = $('<div class="question checkboxes">');
    div.append(renderLabel(data.label));
    for (var i = 0; i < data.options.length; i++) {
        div.append(
            $('<div class="checkbox">')
                .append($('<input type="checkbox">'))
                .append(' ')
                .append($('<label>').text(data.options[i])));
    }
    return div;
}

function renderRandom(data) {
    var div = $('<div class="question random">');
    div.append(renderLabel(data.label));
    div.append($('<a href="#">').text('Generate'));
    return div;
}

function renderNumber(data) {
    var div = $('<div class="question number">');
    div.append(renderLabel(data.label));
    div.append($('<input type="number">'));
    return div;
}

function renderOptions(data) {
    var div = $('<div class="question options">');
    div.append(renderLabel(data.label));
    
    var sel = $('<select>');
    sel.append('<option>');
    for (var i = 0; i < data.options.length; i++) {
        sel.append($('<option>').text(data.options[i]));
    }
    div.append(sel);
    
    if (data.other) {
        sel.append($('<option>').text('Other'));
        var other = $('<input type="text">');
        other.hide();
        div.append(' ').append(other);
    
        $(sel).change(function(e) {
            var value = $(this).val();
            if (value == 'Other') {
                other.show();
            } else {
                other.hide();
                other.select();
            }
        });
    }
    
    return div;
}

function renderLabel(label) {
    return $('<h2>').text(label);
}