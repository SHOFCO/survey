var StorageKey = {
    ROW: 'row',
    ROW_COUNT: 'rowCount',
    
    USER: 'user',
    USER_COUNT: 'userCount'
};

function storageKey() {
    var strings = [];
    for (var i = 0; i < arguments.length; i++) {
        strings.push(arguments[i] + '');
    }
    return strings.join('-');
}

function getObject(var_args) {
    var key = storageKey.apply(this, arguments);
    var value = localStorage.getItem(key);
    return JSON.parse(value);
}

function setObject(var_args) {
    var args = [];
    for (var i = 0; i < arguments.length - 1; i++) {
        args.push(arguments[i]);
    }
    var value = arguments[arguments.length - 1];
    var key = storageKey.apply(this, args);
    localStorage.setItem(key, JSON.stringify(value));
}

function removeObject(var_args) {
    var object = getObject.apply(this, arguments);
    localStorage.removeItem(storageKey.apply(this, arguments));
    return object;
}


function addRow(userId, values) {
    var count = getObject(StorageKey.USER, userId, StorageKey.ROW_COUNT) || 0;
    setObject(StorageKey.USER, userId, StorageKey.ROW, count, values);
    setObject(StorageKey.USER, userId, StorageKey.ROW_COUNT, count + 1);
}

function getRows(userId) {
    var count = getObject(StorageKey.USER, userId, StorageKey.ROW_COUNT) || 0;
    var rows = [];
    for (var i = 0; i < count; i++) {
        rows.push(getObject(StorageKey.USER, userId, StorageKey.ROW, i));
    }
    return rows;
}

function clearAllRows() {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
        clearUserRows(users[i].userId);
    }
}

function clearUserRows(userId) {
    var rowCount = removeObject(StorageKey.USER, userId, StorageKey.ROW_COUNT) || 0;
    for (var j = 0; j < rowCount; j++) {
        removeObject(StorageKey.USER, userId, StorageKey.ROW, j);
    }
}

function createUser(name, pin) {
    var userCount = getObject(StorageKey.USER_COUNT) || 0;
    var user = {
        userId: userCount,
        name: name,
        pin: pin
    };
    
    setObject(StorageKey.USER, userCount, user);
    setObject(StorageKey.USER_COUNT, userCount + 1);
}

function getUsers() {
    var userCount = getObject(StorageKey.USER_COUNT) || 0;
    var users = [];
    for (var i = 0; i < userCount; i++) {
        var user = getObject(StorageKey.USER, i);
        user.rowCount = getObject(StorageKey.USER, i, StorageKey.ROW_COUNT) || 0;
        users.push(user);
    }
    return users;
}