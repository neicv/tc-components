const fs = require('fs')
const path = require('path')
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
    config = {},
    pathToDist = path.join(__dirname, "../..");

console.log('pathToDist: ', pathToDist);

// прицепить существующие шрифты
cssFile = readFileSync(TURBO_FONT_CSS_DEFAULT_FOLDER, TURBO_FONT_CSS_DEFAULT_FILENAME);

if (cssFile) {
    console.log('Processing file: ', TURBO_FONT_CSS_DEFAULT_FILENAME);

    setConfigObj(cssFile, filter, config);
}

// прицепить сгенерированные шрифты
cssFile = readFileSync(GENERATED_FONT_CSS_DEFAULT_FOLDER, GENERATED_FONT_CSS_DEFAULT_FILENAME);

if (cssFile) {
    console.log('Processing file: ', GENERATED_FONT_CSS_DEFAULT_FILENAME);

    setConfigObj(cssFile, cssFile.matchAll(regExp), config);
}

console.log(config)

// Записать конфиг в файл
fs.writeFileSync(path.join(pathToDist, GENERATED_FONT_CSS_DEFAULT_FOLDER, EXPORTED_CONFIG_DEFAULT_FILENAME), JSON.stringify(config, null, 4));


function setConfigObj( file = '', data = [], config ) {
    for(let result of data) {
        const { name, fontName } = result.groups;

        if (name) {
            let regExpValue = new RegExp(`\\.${name}\\.(?<value>[-\\w]+):`, "g");

            let items = file.matchAll(regExpValue);
            config[name] = {};
            config[name].icons = [];
            config[name].name = fontName || name;

            for(let item of items) {
                let { value } = item.groups;
                if (value) {
                    config[name].icons.push(value);
                }
            }
        }
    }
}

function readFileSync(folder = '', filename = '') {
    try {
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
