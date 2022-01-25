/*
    Корректировка CSS файла.
    Так как встроенный механизм корректиовки Url в генерируемом CSS файле от webfont-generator
    не работает (параметр 'cssFontsUrl': './fonts/')
    То данная процедура парсит сгенерированный CSS и исправляет Url к необходимому пути
    А также убирает '__new' из названия иконок.
*/

const fs = require('fs');
const path = require('path');

const pathToDist = path.join(__dirname, "../..");

const {
    TURBO_FONT_CSS_DEFAULT_FOLDER,
    TURBO_FONT_CSS_DEFAULT_FILENAME,
    TURBO_FONT_CSS_REPLACER_FOLDER,
    DESIGANTE_NEW_ICONS_PREFIX
} = require('../constants');

const testRegExp = /url\(.*?(eot|woff|woff2|ttf|eot\?#iefix)[\'|\"]\)/g;
const designateNewIconsPrefix = DESIGANTE_NEW_ICONS_PREFIX || '';

let content = readFile(pathToDist, TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME);

// let result = content.match(/url\(.*?(eot|woff|woff2|ttf)[\'|\"]\)/g) || [];

if (content) {
    console.log('\n\n ----- Patch CSS in ', TURBO_FONT_CSS_DEFAULT_FILENAME, ' ---- \n')
    content = changeContent(TURBO_FONT_CSS_REPLACER_FOLDER, content)

    fs.writeFileSync(path.join(pathToDist, TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME), content);
    console.log('\n ----- Done ! ---- \n');
}

function readFile(pathToDist = '', folder = '', filename = '') {
    try {
        return fs.readFileSync(path.join(pathToDist, folder, filename),
            {encoding:'utf8', flag:'r'},
            function(err, data) {
                if(err)
                    console.log(err);
                else {
                    return data;
                }
            }
        );
    } catch (err) {
        if(err.code == 'ENOENT') {
            console.log('file does not exist: ', filename);
        } else {
            console.log('Some other error: ', err.code);
        }
    }
    return false;
}

function changeContent(mod = '', content = '') {
    if (content === '') return;

    function changeUrl(match) {

        return match.replace(/\/.*?\/([^/]*?\.\S*)/, mod + "$1");
    }

    if (designateNewIconsPrefix) {
        content = content.replace(new RegExp(designateNewIconsPrefix, 'g'), '');
    }

    return content.replace(testRegExp, changeUrl);
}
