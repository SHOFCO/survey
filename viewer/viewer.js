// viewer.js

RENDER = {
    'yesNo': renderYesNo,
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
    var state = {
        questions: []
    };
    
    for (var i = 0; i < pages.length; i++) {
        $(document.body).append(renderPage(state, pages[i]));
    }
    
    state.end = $('<div class="end"><a href="#">Complete This Survey</a></div>').hide();
    $(document.body).append(state.end);
    
    setVisibility(state);
    $(document.body).on('question:change', function() {
        setVisibility(state);
    });
}

function last(arr) {
    return arr[arr.length - 1];
}

function renderPage(state, page) {
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
            div.append(renderQuestion(state, q));
            
            if (q.subs) {
                var parent = last(state.questions);
                for (var j = 0; j < q.subs.length; j++) {
                    var sub = q.subs[j];
                    div.append(renderQuestion(state, sub));
                    last(state.questions).parent = parent;
                }
            }
        }
    }

    return div;
}

function setVisibility(state) {
    $('div.page').hide();
    var i;
    var end = null;
    var endComplete = false;
    for (i = 0; i < state.questions.length; i++) {
        var question = state.questions[i];
        
        if (end && end != question.parent) {
            i = i - 1;
            endComplete = true;
            break;
        }
        if (!question.config.when || question.interpolatedEval(question.config.when)) {
            question.div.show();
            question.div.closest('div.page').show().prevAll('div.page').show();
            if (question.value === undefined) {
                break;
            }
            if (question.config.endSurveyWhen && question.interpolatedEval(question.config.endSurveyWhen)) {
                end = question;
            }
        } else {
            question.div.hide();
        }
    }

    if (i == state.questions.length || endComplete) {
        state.end.show();
    } else {
        state.end.hide();
    }
    
    for (i = i + 1; i < state.questions.length; i++) {
        state.questions[i].div.hide();
    }
    
    $('html, body').animate({ 
        scrollTop: $(document).height() - $(window).height()}, 
        400, 
        'swing');
}

function isValue(value) {
    return value !== '' && value !== undefined && value !== null;
}

function renderQuestion(state, config) {
    var question = {
        number: state.questions.length,
        id: 'question' + state.questions.length,
        config: config
    };
    state.questions.push(question);
    question.setValue = function(value) {
        question.value = isValue(value) ? value : undefined;
        div.trigger('question:change');
    };
    question.interpolate = function(s) {
        if (question.parent) {
            s = s.replace('($parent)', JSON.stringify(question.parent.value));
        }
        return s.replace('($value)', JSON.stringify(question.value));
    }
    question.interpolatedEval = function(s) {
        return eval(question.interpolate(s));
    };

    var div = $('<div class="question ' + config.type + '">');
    div.append($('<h2>').text(config.label));
    RENDER[config.type](div, question, config);
    question.div = div;
    div.hide();

    return div;
}

function renderYesNo(div, question, config) {
    var yes = $('<input type="radio">').attr('name', question.id).attr('id', question.id + '-yes');
    div.append(yes);
    div.append($('<label>').text('Yes').attr('for', question.id + '-yes'));
    div.append(' ');
    yes.change(function() {
        if ($(this).is(':checked')) {
            question.setValue('yes');
        }
    });
    
    var no = $('<input type="radio">').attr('name', question.id).attr('id', question.id + '-no');
    div.append(no);
    div.append($('<label>').text('No').attr('for', question.id + '-no'));
    no.change(function() {
        if ($(this).is(':checked')) {
            question.setValue('no');
        }
    });
}

function renderText(div, question, config) {
    div.append('TODO: text');
}

function renderSignature(div, question, config) {
    div.append($('<a href="#">').text('Sign').click(function(e) {
        e.preventDefault();
        // TODO: PIN entry
        $(this).replaceWith($('<div class="signatureResult">').text('Signed!'));
        question.setValue('signed');
    }));
}

function renderCheckboxes(div, question, config) {
    for (var i = 0; i < config.options.length; i++) {
        var id = question.id + '-' + i;
        div.append(
            $('<div class="checkbox">')
                .append($('<input type="checkbox">').attr('id', id))
                .append(' ')
                .append($('<label>').attr('for', id).text(config.options[i])));
    }
    var checkboxes = div.find('input');
    checkboxes.change(function() {
        var result = [];
        checkboxes.each(function(i, el) {
            result.push([config.options[i], $(el).is(':checked')]);
        });
        question.setValue(result);
        console.log(result);    
    });
}

function renderRandom(div, question, config) {
    div.append($('<a href="#">').text('Generate').click(function(e) {
        var min = parseInt(question.interpolate(question.config.min + ''), 10);
        var max = parseInt(question.interpolate(question.config.max + ''), 10);
        var value = Math.floor(Math.random() * (max - min + 1)) + min;
        $(this).replaceWith($('<div class="randomResult">').text('Random selection: ' + value));
        question.setValue(value);
        e.preventDefault();
    }));
}

function renderNumber(div, question, config) {
    div.append($('<input type="number">').change(function() {
        question.setValue(parseInt($(this).val(), 10));
    }));
}

function renderOptions(div, question, config) {    
    var sel = $('<select>');
    sel.append('<option>');
    for (var i = 0; i < config.options.length; i++) {
        sel.append($('<option>').text(config.options[i]));
    }
    div.append(sel);
    
    if (config.other) {
        sel.append($('<option>').text('Other'));
        var other = $('<input type="text">');
        other.hide();
        div.append(' ').append(other);
    
        $(sel).change(function(e) {
            var value = $(this).val();
            if (value == 'Other') {
                other.show();
                other.select();
                question.setValue(other.val());
            } else {
                other.hide();
                question.setValue(value);
            }
        });
        
        other.change(function() {
            question.setValue(other.val());
        });
    } else {
        $(sel).change(function() {
            question.setValue($(this).val());
        })
    }
}