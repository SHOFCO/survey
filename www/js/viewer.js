// viewer.js

RENDER = {
    'yesNo': renderYesNo,
    'text': renderText,
    'signature': renderSignature,
    'checkboxes': renderCheckboxes,
    'random': renderRandom,
    'number': renderNumber,
    'options': renderOptions,
    'table': renderTable,
    'person': renderPerson
}

window.loggedInUser = null;

function renderViewer() {
	cordova.plugins.email.isAvailable(
	    function (isAvailable) {
			if (!isAvailable) {
				alert('Please set up an email account');
			}
	    }
	);
	
    $('#createUser form').submit(function(e) {
        e.preventDefault();
        var name = $('#createUserName').val();
        var pin = $('#createUserPin').val();
        var pinVerify = $('#createUserPinVerify').val();
        if (!name) {
            alert('Name is required');
            $('#createUserName').select();
        } else if (!pin) {
            alert('Pin is required');
            $('#createUserPin').select();
        } else if (pin.length < 4) {
            alert('Pin length must be at least 4');
            $('#createUserPin').select();
        } else if (pin != pinVerify) {
            alert('Pin and verification must match');
            $('#createUserPin').select();
        } else {
            createUser(name, pin);
            renderUserPicker();
            $('#createUser').hide();
        }
    });
    renderUserPicker();
    $('#userPicker').show();
    if (getUrlParameter('user')) {
        selectUser(getUsers()[window.parseInt(getUrlParameter('user'), 10)]);
    }
}

function selectUser(user) {
    window.loggedInUser = user;
    $('#userPicker').hide();
    renderPages();
    $('#survey').show();
}

function renderUserPicker() {
    var users = getUsers();
    var root = $('#userPicker');
    root.empty();
    var usersDiv = $('<div id="userList">');
    for (var i = 0; i < users.length; i++) {
        var userDiv = $('<div class="user">');
        var user = users[i];
        
        usersDiv.append($('<a href="#">').text(user.name).click(function(user, e) {
            e.preventDefault();
            var pin = prompt('Enter pin for ' + user.name);
            if (pin == user.pin) {
                selectUser(user);
            } else {
                alert('Incorrect PIN');
            }
        }.bind(this, user)));
        
        if (user.rowCount) {
            usersDiv.append(' (' + user.rowCount + ' completed - ');
            var downloadLink = $('<a>').text('download');
            if (device.platform == 'browser') {
                downloadLink.attr('href', csvUrl(getRows(user.userId)));                
            } else {
                downloadLink.attr('href', '#').click(function(e) {
                    window.plugin.email.open({
                        to: 'systemadmin@shofco.org',
                        subject: 'Survey results',
                        attachments: 'base64:survey.csv//' + btoa(csv(getRows(user.userId)))
                    });
                });
            }
            usersDiv.append(downloadLink);
            usersDiv.append(' - ');
            usersDiv.append($('<a href="#">').text('clear').click(function(user, e) {
                e.preventDefault();
                if (confirm('Are you sure you want to clear ' + user.rowCount + ' rows?')) {
                    clearUserRows(user.userId);
                    renderUserPicker();
                }
            }.bind(this, user)));
            usersDiv.append(')');
        }
    }
    root.append(usersDiv);
    root.append($('<br>'))
    root.append($('<button>').text('New user').click(function() {
        $('#createUser input').val('');
        $('#createUser').show();
        $('#createUserName').select();
    }));
}

function itemAt(arr, index) {
    index = parseInt(index, 10);
    if (index < 0) {
        index += arr.length;
    } else {
        index -= 1;
    }
    return arr[index];
}

function appendToArrays(keys, values, object) {
    for (var key in object) {
        keys.push(key);
        values.push(object[key]);
    }
}

function renderPages() {
    var pages = window.pages;
    var state = {
        questions: [],
        references: {},
        startTime: new Date(),
        endTime: null,
        coords: null
    };
    window.debugState = state;
    
    var gpsRoot = $('<div id="gpsRoot">');
	var gpsStatus = $('<span id="gpsStatus">').text('GPS: Loading');
	var lat = $('<input placeholder="lat" name="lat" type="text">');
	var lng = $('<input placeholder="long" name="lng" type="text">');
	gpsRoot.append(gpsStatus, ' ', lat, ' ', lng)
    navigator.geolocation.getCurrentPosition(function(location) {
        // Success.
        state.coords = location.coords;
		lat.val(location.coords.latitude + '');
		lng.val(location.coords.longitude + '');
        gpsStatus.text('GPS: OK').addClass('ok');
    }, function(err) {
        // Errors.
        gpsStatus.click(function() {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    alert('Error getting GPS coordinate: permission denied');
                    break;
                case err.POSITION_UNAVAILABLE:
                    alert('Error getting GPS coordinate: position unavailable');
                    break;
                case err.TIMEOUT:
                    alert('Error getting GPS coordinate: timeout');
                    break;
                default:
                    alert('Unknown error getting GPS coordinate');          
            }
        }).text('GPS: Error').addClass('error');
    }, {
        enableHighAccuracy: true,
        timeout: 90000,
        maximumAge: 0
    });
    
    var filter = getUrlParameter('filter');
    if (filter) {
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
    
    var root = $('#survey');
    root.empty();
    root.append(gpsRoot);
    for (var i = 0; i < pages.length; i++) {
        $(root).append(renderPage(state, pages[i]));
    }
    
    state.end = $('<div class="end"><a href="#">Complete This Survey</a></div>').hide().click(function() {
        state.endTime = new Date();
        var keys = [];
        var values = [];
        appendToArrays(keys, values, {  
            "Start Time": state.startTime,
            "End Time": state.endTime,
            "Latitude": lat.text(),
            "Longitude": lng.text(),
            "GPS Accuracy": state.coords ? state.coords.accuracy : null
        });        
        
        for (var i = 0; i < state.questions.length; i++) {
            var result = {};
            var q = state.questions[i];
            q.serializeValue(result);
            if (q.value instanceof Skipped) {
                for (var key in result) {
                    result[key] = q.value;
                }
            }
            appendToArrays(keys, values, result);
        }

        addRow(window.loggedInUser.userId, [keys, values]);
        
        renderUserPicker();
        $('#userPicker').show();
        $('#survey').hide();
    });
    $(root).append(state.end);
    
    setVisibility(state, false);
    $('div.question').on('question:change', function() {
        var sel = $(this);
        var willScroll = !sel.hasClass('checkboxes') && !sel.hasClass('random');
        setVisibility(state, willScroll);
        
        if (willScroll) {
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

function renderQuestions(state, div, pageConfig, questions, level, opt_parent) {
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        div.append(renderQuestion(state, q, pageConfig, level));
        last(state.questions).parent = opt_parent;
        
        if (q.specialSub == 'frequency') {
            q.subs = q.subs || [];
            q.subs.unshift({
                label: "How often has this occurred in the last 12 months?",
                when: "($parent) == 'Yes'",
                type: "options",
                options: ["Often", "Sometimes", "Rarely", "Has not occurred in the last 12 months"]
            });
            delete q.specialSub;
        }
        if (q.subs) {
            renderQuestions(state, div, pageConfig, q.subs, level + 1, last(state.questions));
        }
    }
}

function interpolateStatic(s) {
    return s.replace(/\(([^)]+)\)/g, function(fullMatch, varName) {
        var replacement;
        switch (varName) {
            case '$user': replacement = window.loggedInUser.name; break;
            default: replacement = fullMatch;
        }
        return replacement;
    });
}

function renderPage(state, page) {
    var div = $('<div class="page">');
    div.append($('<h1>').text(page.title));
    if (page.static) {
        var paras = page.static.split(/\n\n+/);
        for (var i = 0; i < paras.length; i++) {
            div.append($('<div class="static">').text(interpolateStatic(paras[i])));
        }
    }
    if (page.questions) {
        renderQuestions(state, div, page, page.questions, 1);
    } else {
        div.addClass('staticOnly');
    }
    if (page.footer) {
        div.addClass('footer');
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
    return count;
}

function renderQuestion(state, config, pageConfig, level) {
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
    question.serializeValue = function(resultObject) {
        resultObject['Question: ' + this.config.label] = this.value;
    };
    question.interpolate = function(s) {
        s = interpolateStatic(s);
        return s.replace(/\(([^)]+)\)/g, function(_, varName) {
            var replacement;
            var filters = varName.split(':');
            varName = filters[0];
            switch (varName) {
                case '$parent': replacement = question.parent.value; break;
                case '$value': replacement = question.value; break;
                default: replacement = state.references[varName];
            }
            if (replacement instanceof Skipped) {
                replacement = undefined;
            }
            for (var i = 1; i < filters.length; i++) {
                switch (filters[i]) {
                    case 'countCheckboxes': replacement = countCheckboxes(replacement); break;
                    case 'skipped': replacement = replacement === undefined; break; 
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

    var div = $('<div class="question ' + config.type + ' level' + level + '">');
    if (!config.unskippable) {
        var skipDiv = $('<div class="skip">');
        skipDiv.append($('<a href="#">').text('Skip').click(function(e) {
            e.preventDefault();
            div.find('input, select, textarea').filter(':not(.skipReason)').prop('disabled', !div.hasClass('skipped'));
            if (div.hasClass('skipped')) {
                skipDiv.find('a').text('Skip');
                div.removeClass('skipped');
                question.setValue(undefined);
            } else {
                skipDiv.find('.skip').text('Skipped');
                div.addClass('skipped');
                skipDiv.find('select').select();
            }
        }));
        skipDiv.append($('<select class="skipReason">')
            .append(option())
            .append(option('Respondent doesn\'t have/know answer'))
            .append(option('Respondent is uncomfortable with the question/refuses to answer'))
            .append(option('Not applicable'))
            .append(option('Other'))
            .change(function() {
                question.setValue(new Skipped($(this).val()));
            }));
        div.append(skipDiv);
    }
    div.append($('<h2>').text(config.label));
    if (config.instructions) {
        div.append($('<div class="instructions">').text(config.instructions));
    }
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
        var ancestor = question.parent;
        while (ancestor && shouldShow) {
            if (ancestor.value instanceof Skipped) {
                shouldShow = false;
            }
            ancestor = ancestor.parent;
        }
        if (shouldShow && question.config.when) {
            shouldShow = question.interpolatedEval(question.config.when);
        }
        if (shouldShow && question.pageConfig.when) {
            shouldShow = question.interpolatedEval(question.pageConfig.when);
        }
        if (shouldShow) {
            question.div.show();
            question.div.closest('div.page').show().prevAll('div.page.staticOnly').show();
            if (!question.hasBeenShown) {
                if (scroll) {
                    question.div.find('input, textarea').first().select();
                }
                question.hasBeenShown = true;
            }
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
        $('.footer').show();
    } else {
        state.end.hide();
    }
    
    for (i = i + 1; i < state.questions.length; i++) {
        state.questions[i].div.hide();
    }
}

function renderGenericYesNo(div, id, valueHandler) {
    var yes = $('<input type="radio">').attr('name', id).attr('id', id + '-yes');
    div.append(yes);
    div.append($('<label>').text('Yes').attr('for', id + '-yes'));
    div.append(' ');
    yes.change(function() {
        if ($(this).is(':checked')) {
            valueHandler('Yes');
        }
    });
    
    var no = $('<input type="radio">').attr('name', id).attr('id', id + '-no');
    div.append(no);
    div.append($('<label>').text('No').attr('for', id + '-no'));
    no.change(function() {
        if ($(this).is(':checked')) {
            valueHandler('No');
        }
    });
}

function renderYesNo(div, question, config) {
    renderGenericYesNo(div, question.id, function(value) {
        question.setValue(value);
    });
}

function renderText(div, question, config) {
    if (config.rows == 1 || config.rows === undefined) {
        input = $('<input type="text">');
    } else {
        input = $('<textarea>').attr('rows', config.rows);
    }
    div.append(input.change(function() {
        question.setValue($(this).val());
    }));
}

function renderSignature(div, question, config) {
    // Nothing to serialize in this case.
    question.serializeValue = function() {};
    
    div.append($('<a href="#">').text('Sign').click(function(e) {
        e.preventDefault();
        if (prompt(window.loggedInUser.name + ', please enter your PIN:') == window.loggedInUser.pin) {
            $(this).replaceWith($('<div class="signatureResult">').text('Signed!'));
            question.setValue('signed');
        } else {
            alert('Incorrect pin');
        }
    }));
}

function renderCheckboxes(div, question, config) {
    question.serializeValue = function(resultObject) {
        resultObject[config.label] = ''; // Add a marker column.
        var values = this.value || {};
        for (var i = 0; i < config.options.length; i++) {
            var key = config.options[i];
            resultObject[key] = (key in values) ? values[key] : '';
        }
        if (config.other) {
            resultObject['Other'] = ('Other' in values) ? values['Other'] : '';
        }
    };
    
    var table = $('<table cellspacing=0 cellpadding=0 border=0>');
    div.append(table);
    for (var i = 0; i < config.options.length; i++) {
        var tr = $('<tr class="checkbox">');
        var id = question.id + '-' + i;
        var checkbox = $('<input type="checkbox">').attr('id', id);
        tr.append($('<td>').append(checkbox));
        tr.append($('<td>').append(
            $('<label>').attr('for', id).text(config.options[i])));
        if (config.forceChoice) {
            checkbox.hide();
            var td = $('<td>');
            renderGenericYesNo(td, id, function(checkbox, value) {
                checkbox.prop('checked', value == 'Yes');
                checkbox.addClass('set');
            }.bind(null, checkbox));
            tr.append(td);
        }
        table.append(tr);
    }
    var otherId = question.id + '-other';
    var otherLabelId = otherId + '-label';
    var otherTextId = otherId + '-text';
    if (config.other) {
        var tr = $('<tr class="checkbox">');
        tr.append($('<td>').append(
            $('<input type="checkbox">').attr('id', otherId)));
        tr.append($('<td>').append(
            $('<label>').attr('for', otherId).attr('id', otherLabelId).text('Other')));
        tr.append($('<td>').append(
            $('<input type="text">').attr('id', otherTextId).hide()));
        table.append(tr);
    }
    var checkboxes = div.find('input[type=checkbox]');
    var noneId = question.id + '-none';
    var updateValue = function() {
        var result = {};
        var any = false;
        var allSet = true;
        checkboxes.each(function(i, el) {
            var val = $(el).is(':checked');
            if (i < config.options.length) {
                result[config.options[i]] = val;
                allSet = allSet && $(el).hasClass('set');
            } else if (val) {
                var text = $('#' + otherTextId);
                text.show()
                if (this.id == otherId) {
                    text.select();
                }
                val = text.val();
                result['Other'] = val;
            } else {
                result['Other'] = '';
                $('#' + otherTextId).hide();
            }
            any = any || !!val;
        });
        if (config.forceChoice ? allSet : any) {
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
        var tr = $('<tr>');
        tr.append($('<td>').append(input));
        tr.append($('<td>').append(
            $('<label>').attr('for', noneId).text('None of the above')));
        table.append(tr);
        input.change(function() {
            if ($(this).is(':checked')) {
                checkboxes.prop('checked', false);
            }
            updateValue();
        });
    }
}

function renderRandom(div, question, config) {
    // Nothing to serialize in this case.
    question.serializeValue = function() {};

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
    question.serializeValue = function(resultObject) {
        resultObject[config.label] = ''; // Add a marker column.
        var values = this.value || {};
        for (var i = 0; i < config.keys.length; i++) {
            var key = config.keys[i];
            resultObject[key] = values[key];
        }
    };

    var table = $('<table>');
    var tr;
    
    if (config.valueLabel) {
        tr = $('<tr>');
        tr.append($('<th>').text(config.keyLabel));
        tr.append($('<th>').text(config.valueLabel));
        table.append($('<thead>').append(tr));
    }
    
    var tbody = $('<tbody>');
    table.append(tbody);
    
    var inputs;
    var updateFn = function() {
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
    };

    for (var i = 0; i < config.keys.length; i++) {
        tr = $('<tr>');
        tr.append($('<td>').text(config.keys[i]));
        
        var valueTd = $('<td>');
        if (config.valueType == 'yesNo') {
            var input = $('<input class="tableRow">').attr('type', 'hidden');
            valueTd.append(input);
            renderGenericYesNo(valueTd, question.id + '-' + i, function(input, value) {
                input.val(value);
                updateFn();
            }.bind(null, input));
        } else {
            valueTd.append($('<input class="tableRow">').attr('type', config.valueType || 'text'));
        }
        tr.append(valueTd);
        tbody.append(tr);
    }
    
    inputs = table.find('input.tableRow');
    inputs.change(updateFn);
    
    div.append(table);
}

function renderGenericField(div, id, label, html) {
    var innerDiv = $('<div>');
    
    innerDiv.append($('<label for="' + id + '">' + label + '</label>'));
    innerDiv.append(' ');
    var result = $(html).attr('id', id).data('key', label);
    innerDiv.append(result);
    div.append(innerDiv);
    return result;
}

function option(opt_text, opt_value) {
    opt_text = opt_text || '';
    return $('<option>').text(opt_text).attr('value', opt_value || opt_text);
}

function renderPerson(div, question, config) {
	var feesKey = 'School fees';
	var freqKey = 'School fee frequency';
	var sponsoredKey = 'Sponsored';
    var keys = [
        config.label,
        'Birthdate',
        'Gender',
        'Relationship',
        'Level of schooling',
        'Employment Status',
        'Employment Type',
        'Average monthly income',
        sponsoredKey,
        feesKey,
        freqKey
    ];
    var result = {};
    question.serializeValue = function(resultObject) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            resultObject[key] = result[key];
        }
    };

    result[config.label] = '';

    var onChange = function(key) {
        var key = $(this).data('key');
        result[key] = $(this).val();
        if (Object.keys(result).length >= keys.length) {
            question.setValue(result);
        }
    };
    renderGenericField(div, question.id + '-birthdate', 'Birthdate', '<input type="date">').change(onChange);
    renderGenericField(div, question.id + '-gender', 'Gender', '<select>')
        .append(option())
        .append(option('Male'))
        .append(option('Female'))
        .append(option('Other'))
        .change(onChange);
    renderGenericField(div, question.id + '-relationship', 'Relationship', '<input type="text">')
        .val(config.relationship || '')
        .change(onChange);
    if (config.relationship) {
        result['Relationship'] = config.relationship;
    }
    renderGenericField(div, question.id + '-schooling', 'Level of schooling', '<select>')
        .append(option())
        .append(option('None', '1'))
        .append(option('Some primary (dropped out)', '2'))
        .append(option('Completed primary', '3'))
        .append(option('Some secondary (dropped out)', '4'))
        .append(option('Completed secondary', '5'))
        .append(option('Completed vocational training', '6'))
        .append(option('Some university (dropped out)', '7'))
        .append(option('Completed university', '8'))
        .append(option('Some college (dropped out)', '9'))
        .append(option('Completed college', '10'))
        .append(option('Currently attending primary', '11'))
        .append(option('Currently attending secondary', '12'))
        .append(option('Currently attending university', '13'))
        .append(option('Currently attending college', '14'))
        .append(option('Currently attending vocational training', '15'))
        .change(function(e) {
			var feesField = $('#' + question.id + '-school-fees');
			var freqField = $('#' + question.id + '-school-fee-timeframe');
			var sponsoredField = $('#' + question.id + '-sponsored');
			var val = $(this).val();
			if (val != '11' && val != '12' && val != '13' && val != '14' && val != '15') {
				result[feesKey] = 'N/A';
				result[freqKey] = 'N/A';
				result[sponsoredKey] = 'N/A';
				feesField.prop('disabled', true);
				freqField.prop('disabled', true);
				sponsoredField.prop('disabled', true);
			} else {
				feesField.prop('disabled', false);
				freqField.prop('disabled', false);
				sponsoredField.prop('disabled', false);

				if (feesField.val() != '') {
					result[feesKey] = feesField.val();
				} else {
					delete result[feesKey];
				}
				
				if (freqField.val() != '') {
					result[freqKey] = freqField.val();
				} else {
					delete result[freqKey];
				}
				
				if (sponsoredField.val() != '') {
					result[sponsoredKey] = sponsoredField.val();
				} else {
					delete result[sponsoredKey];
				}
			}

        	onChange.call(this, e);
        });
    
    renderGenericField(div, question.id + '-employment', 'Employment Status', '<select>')
        .append(option())
        .append(option('Unemployed', '1'))
        .append(option('Self-employed part time', '2'))
        .append(option('Self-employed full time', '3'))
        .append(option('Employed part time', '4'))
        .append(option('Employed full time', '5'))
        .append(option('Casual labor', '6'))
        .change(onChange);
        
    var onEmploymentTypeChange = function(e) {
        var select = $('#' + question.id + '-employment-type');
        var val = select.val();
        var otherText = $('#' + question.id + '-other-employment-type');
        if (val == 'Other') {
            val = otherText.show().val();
        } else {
            otherText.hide();
        }
        if (val) {
            onChange.call(select.get(0), e);
        }
    };
    renderGenericField(div, question.id + '-employment-type', 'Employment Type', '<select>')
        .append(option())
        .append(option('Vendor', '1'))
        .append(option('Carpentry', '2'))
        .append(option('Construction', '3'))
        .append(option('Education', '4'))
        .append(option('Medical', '5'))
        .append(option('Security', '6'))
        .append(option('Tailoring', '7'))
        .append(option('Housewife', '8'))
        .append(option('Domestic Services (Cleaning, Laundry)', '9'))
        .append(option('Other'))
        .change(onEmploymentTypeChange)
        .parent()
            .append(' ').append(
                $('<input type="text">')
                    .attr('id', question.id + '-other-employment-type')
                    .hide()
                    .change(onEmploymentTypeChange));
    renderGenericField(div, question.id + '-income', 'Average monthly income', '<input type="number">')
        .change(onChange)
        .parent().append(' Ksh');
    renderGenericField(div, question.id + '-sponsored', sponsoredKey, '<select>')
        .append(option())
        .append(option('Yes'))
        .append(option('No'))
        .change(onChange);
        
    var fees = renderGenericField(div, question.id + '-school-fees', feesKey, '<input type="number">')
        .change(onChange);
    fees.parent().append(' Ksh ');
    
    var term = renderGenericField(div, question.id + '-school-fee-timeframe', freqKey, '<select>')
        .append(option())
        .append(option('per month'))
        .append(option('per term'))
        .append(option('per year'))
        .change(onChange);
    
    term.parent().detach();
    fees.parent().append(term);
}