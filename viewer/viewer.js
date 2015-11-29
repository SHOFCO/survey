// viewer.js

RENDER = {
    'yesNo': renderYesNo,
    'text': renderText,
    'signature': renderSignature,
    'checkboxes': renderCheckboxes,
    'random': renderRandom,
    'number': renderNumber,
    'options': renderOptions,
    'table': renderTable
}

$(document).ready(function() {
    $.getJSON('baseline-2016.json', function(pages) {
        render(pages);
    });
});

function itemAt(arr, index) {
    index = parseInt(index, 10);
    if (index < 0) {
        index += arr.length;
    } else {
        index -= 1;
    }
    return arr[index];
}

function render(pages) {
    var state = {
        questions: [],
        references: {}
    };
    window.debugState = state;
    
    if (location.search.substr(0, 8) == '?filter=') {
        var filter = location.search.substr(8);
        var parts = filter.split('+');
        var newPages = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i].split(':');
            newPages.push(itemAt(pages, part[0]));
            if (part[1]) {
                var modifyingPage = last(newPages);
                var subParts = part[1].split(',');
                var newQuestions = [];
                for (var j = 0; j < subParts.length; j++) {
                    newQuestions.push(itemAt(modifyingPage.questions, subParts[j]));
                }
                modifyingPage.questions = newQuestions;
            }
        }
        pages = newPages;
    }
    
    for (var i = 0; i < pages.length; i++) {
        $(document.body).append(renderPage(state, pages[i]));
    }
    
    state.end = $('<div class="end"><a href="#">Complete This Survey</a></div>').hide();
    $(document.body).append(state.end);
    
    setVisibility(state);
    $('div.question').on('question:change', function() {
        setVisibility(state);
        
        var sel = $(this);
        if (!sel.hasClass('checkboxes') && !sel.hasClass('random')) {
            scrollPast(sel);
        }
    });
}

function scrollPast(selector) {
    $('html, body').animate(
        {scrollTop: selector.offset().top + selector.height()}, 
        400, 
        'swing');
}

function last(arr) {
    return arr[arr.length - 1];
}

function renderQuestions(state, div, pageConfig, questions, opt_parent) {
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        div.append(renderQuestion(state, q, pageConfig));
        last(state.questions).parent = opt_parent;
        
        if (q.subs) {
            renderQuestions(state, div, pageConfig, q.subs, last(state.questions));
        }
    }
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
        renderQuestions(state, div, page, page.questions);
    } else {
        div.addClass('staticOnly');
    }

    return div;
}

function isValue(value) {
    return value !== '' && value !== undefined && value !== null;
}

function countCheckboxes(obj) {
    var count = 0;
    for (var key in obj) {
        if (obj[key]) {
            count++;
        }
    }
    console.log(count, obj);
    return count;
}

function renderQuestion(state, config, pageConfig) {
    var question = {
        number: state.questions.length,
        id: 'question' + state.questions.length,
        config: config,
        pageConfig: pageConfig
    };
    state.questions.push(question);
    question.setValue = function(value) {
        question.value = isValue(value) ? value : undefined;
        if (config.referenceAs) {
            state.references[config.referenceAs] = question.value;
        }
        div.trigger('question:change');
    };
    question.interpolate = function(s) {
        return s.replace(/\(([^)]+)\)/g, function(_, varName) {
            var replacement;
            var filters = varName.split(':');
            varName = filters[0];
            switch (varName) {
                case '$parent': replacement = question.parent.value; break;
                case '$value': replacement = question.value; break;
                default: replacement = state.references[varName];
            }
            for (var i = 1; i < filters.length; i++) {
                switch (filters[i]) {
                    case 'countCheckboxes': replacement = countCheckboxes(replacement); break;
                    default: throw 'Bad filter: ' + filters[i];
                }
            }
            return JSON.stringify(replacement);
        });
    }
    question.interpolatedEval = function(s) {
        try {
            return eval(question.interpolate(s));
        } catch (e) {
            console.log('Error evaluating: ' + JSON.stringify(s));
            console.log('After interpolation: ' + JSON.stringify(question.interpolate(s)));
            console.error(e);
            throw e;
        }
    };

    var div = $('<div class="question ' + config.type + '">');
    div.append($('<h2>').text(config.label));
    RENDER[config.type](div, question, config);
    question.div = div;
    div.hide();

    return div;
}

function setVisibility(state, scroll) {
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
        var shouldShow = true;
        if (question.config.when) {
            shouldShow = question.interpolatedEval(question.config.when);
        }
        if (shouldShow && question.pageConfig.when) {
            shouldShow = question.interpolatedEval(question.pageConfig.when);
        }
        if (shouldShow) {
            question.div.show();
            question.div.closest('div.page').show().prevAll('div.page.staticOnly').show();
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
}

function renderYesNo(div, question, config) {
    var yes = $('<input type="radio">').attr('name', question.id).attr('id', question.id + '-yes');
    div.append(yes);
    div.append($('<label>').text('Yes').attr('for', question.id + '-yes'));
    div.append(' ');
    yes.change(function() {
        if ($(this).is(':checked')) {
            question.setValue('Yes');
        }
    });
    
    var no = $('<input type="radio">').attr('name', question.id).attr('id', question.id + '-no');
    div.append(no);
    div.append($('<label>').text('No').attr('for', question.id + '-no'));
    no.change(function() {
        if ($(this).is(':checked')) {
            question.setValue('No');
        }
    });
}

function renderText(div, question, config) {
    if (config.rows == 1 || config.rows === undefined) {
        input = $('<input type="text">');
    } else {
        input = $('<textarea>').attr('rows', config.rows);
    }
    div.append(input.change(function() {
        question.setValue(parseInt($(this).val(), 10));
    }));
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
    var otherId = question.id + '-other';
    var otherLabelId = otherId + '-label';
    var otherTextId = otherId + '-text';
    if (config.other) {
        div.append(
            $('<div class="checkbox">')
                .append($('<input type="checkbox">').attr('id', otherId))
                .append(' ')
                .append($('<label>').attr('for', otherId).attr('id', otherLabelId).text('Other'))
                .append($('<input type="text">').attr('id', otherTextId).hide()));
    }
    var checkboxes = div.find('input[type=checkbox]');
    var noneId = question.id + '-none';
    var updateValue = function() {
        var result = {};
        var any = false;
        checkboxes.each(function(i, el) {
            var val = $(el).is(':checked');
            if (i < config.options.length) {
                result[config.options[i]] = val;
            } else if (val) {
                var text = $('#' + otherTextId);
                text.show()
                if (this.id == otherId) {
                    text.select();
                }
                val = text.val();
                result['Other'] = val;
                $('#' + otherLabelId).hide();
            } else {
                result['Other'] = '';
                $('#' + otherLabelId).show();
                $('#' + otherTextId).hide();
            }
            any = any || val;
        });
        if (any) {
            question.setValue(result);
            $('#' + noneId).prop('checked', false);
        } else if ($('#' + noneId).is(':checked')) {
            question.setValue(result);
        } else {
            question.setValue(undefined);
        }
    };
    div.find('input').change(updateValue);

    if (config.noneOfTheAbove) {
        var input = $('<input type="checkbox">').attr('id', noneId);
        div.append(
            $('<div class="checkbox">')
                .append(input)
                .append(' ')
                .append($('<label>').attr('for', noneId).text('None of the above')));
        input.change(function() {
            if ($(this).is(':checked')) {
                checkboxes.prop('checked', false);
            }
            updateValue();
        });
    }
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

function renderTable(div, question, config) {
    var table = $('<table>');
    var tr = $('<tr>');
    tr.append($('<th>').text(config.keyLabel));
    tr.append($('<th>').text(config.valueLabel));
    table.append($('<thead>').append(tr));
    
    var tbody = $('<tbody>');
    table.append(tbody);
    
    for (var i = 0; i < config.keys.length; i++) {
        tr = $('<tr>');
        tr.append($('<td>').text(config.keys[i]));
        tr.append($('<td>').append($('<input>').attr('type', config.valueType || 'text')));
        tbody.append(tr);
    }
    
    var inputs = table.find('input');
    inputs.change(function() {
        var result = {};
        var all = true;
        inputs.each(function(i, el) {
            var value = $(el).val();
            result[config.keys[i]] = value;
            if (value === '') {
                all = false;
            }
        });
        if (all) {
            question.setValue(result);
        }
    });
    
    div.append(table);
}
