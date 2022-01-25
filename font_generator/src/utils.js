const { DESIGANTE_NEW_ICONS_ENABLE } = require('../constants');

const renameIcons = function(name) {
    let old_name = name;
    // delete path
    name = name.replace(/^.*[\\\/]/, '');
    // 005-parameter__new.svg
    // delete numbers & - & extention
    name = name.replace(/^\d*\-([-\w]+)[.\w]+/, '$1');
    // delete __new
    if (!DESIGANTE_NEW_ICONS_ENABLE) {
        name = name.replace(/([-\w]+)__[\w]+/, '$1');
    }

    console.log('rename: ', old_name, 'to: ', name);

    return name;
}

module.exports = {
    renameIcons
}
