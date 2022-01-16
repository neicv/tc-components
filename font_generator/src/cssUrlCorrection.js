const fs = require('fs');
const path = require('path');

const pathToDist = path.join(__dirname, "../..");

const {
    TURBO_FONT_CSS_DEFAULT_FOLDER,
    TURBO_FONT_CSS_DEFAULT_FILENAME,
    TURBO_FONT_CSS_REPLACER_FOLDER
} = require('../constants');

const testRegExp = /url\(.*?(eot|woff|woff2|ttf|eot\?#iefix)[\'|\"]\)/g

let content = readFile(pathToDist, TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME);

// let result = content.match(/url\(.*?(eot|woff|woff2|ttf)[\'|\"]\)/g) || [];

if (content) {
    console.log('\n\n ----- Patch CSS Url in ', TURBO_FONT_CSS_DEFAULT_FILENAME, ' ---- \n')
    content = renameUrl(TURBO_FONT_CSS_REPLACER_FOLDER, content)

    fs.writeFileSync(path.join(pathToDist, TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME), content);
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

function renameUrl(mod = '', content = '') {
    if (content === '') return;

    function changeUrl(match) {

        return match.replace(/\/.*?\/([^/]*?\.\S*)/, mod + "$1");
      }
    return content.replace(testRegExp, changeUrl)
}
