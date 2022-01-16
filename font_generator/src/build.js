const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const regExp = /font-family:\s*\"(?<name>[-\w]+)\";/g

const {
    TURBO_FONT_CSS_DEFAULT_FOLDER,
    TURBO_FONT_CSS_DEFAULT_FILENAME,
    GENERATED_FONT_CSS_DEFAULT_FOLDER,
    GENERATED_FONT_CSS_DEFAULT_FILENAME,
    EXPORTED_CONFIG_DEFAULT_FILENAME
} = require('../constants');

const filter = [
    {
        groups: {
            name: 'font-icon',
            fontName: 'Turbocontract'
        }
    },
    {
        groups: {
            name: 'editor-icon',
            fontName: 'turboeditor'
        }
    }
]

let cssFile,
    tmpName,
    config = {},
    configFile = '',
    pathToDist = path.join(__dirname, "../..");

console.log('pathToDist: ', pathToDist);

// прицепить существующие шрифты
// cssFile = readFileSync(TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME);

// if (cssFile) {
//     console.log('Processing file: ', TURBO_FONT_CSS_DEFAULT_FILENAME);

//     setConfigObj(cssFile, filter, config);
// }

// прицепить сгенерированные шрифты
cssFile = readFileSync(pathToDist, GENERATED_FONT_CSS_DEFAULT_FOLDER, GENERATED_FONT_CSS_DEFAULT_FILENAME);

if (cssFile) {
    console.log('Processing file: ', GENERATED_FONT_CSS_DEFAULT_FILENAME);

    setConfigObj(cssFile, cssFile.matchAll(regExp), config);
}

console.log(config)

// Записать конфиг в файл
configFile = 'export const icons = ' + JSON.stringify(config, null, 4) + '\n';
fs.writeFileSync(path.join(pathToDist, GENERATED_FONT_CSS_DEFAULT_FOLDER, EXPORTED_CONFIG_DEFAULT_FILENAME), configFile);


function setConfigObj( file = '', data = [], config ) {
    for(let result of data) {
        let { name, fontName } = result.groups;

        if (name) {
            tmpName = checkNameFont(name, filter);

            if (tmpName !== name) {
                fontName = fontName || name;
                name = tmpName;
            }

            let regExpValue = new RegExp(`\\.${name}\\.(?<value>[-\\w]+):.+\\s+content:\\s"\\\\(?<code>[\\w]+)`, "g");
            let items       = file.matchAll(regExpValue);

            config[name] = {};
            config[name].icons = {
                name: [],
                code: []
            };
            config[name].name = fontName || name;

            for(let item of items) {
                let { value, code } = item.groups;
                if (value) {
                    config[name].icons.name.push(value);
                    config[name].icons.code.push(code);
                }
            }
        }
    }
}

function readFileSync(pathToDist = '', folder = '', filename = '') {
    try {
        console.log('\n ---- \n ReadFileSync: \n', pathToDist, folder, filename)
        let stat = fs.statSync(path.join(pathToDist, folder, filename));

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

        return false;
    }
}

function checkNameFont(value, list) {

    for (let variant of list) {
        const { name, fontName } = variant.groups;

        if (value === fontName) {
            value = name;
            break;
        }
    }

    return value;
}
