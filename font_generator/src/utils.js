const renameIcons = function(name) {
    // delete path
    name = name.replace(/^.*[\\\/]/, '');
    // 005-parameter__new.svg
    // delete numbers & - & extention
    name = name.replace(/^\d*\-([-\w]+)[.\w]+/, '$1');
    // delete __new
    name = name.replace(/([-\w]+)__[\w]+/, '$1');
    console.log(name);

    return name;
}

module.exports = {
    renameIcons
}
