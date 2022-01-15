import { readdirSync } from 'fs';
import { join } from 'path';
const normalizedPath = join(__dirname, "config");

readdirSync(normalizedPath).forEach(function(file) {
  require("./config/" + file);
});


// sample config

// module.exports = {
//     'files': [
//       '../fonts/editor/*.svg'
//     ],
//     'fontName': 'turboeditor',
//     'classPrefix': 'editor-icon.',
//     'baseSelector': '.editor-icon',
//     'types': ['eot', 'woff', 'woff2', 'ttf', 'svg'],
//     'fileName': 'turboeditor/[fontname].[ext]',
//     'startCodepoint': 0xE001,
//     'rename': function renameIcons(name) {
//         // delete path
//         name = name.replace(/^.*[\\\/]/, '')
//         // 005-parameter__new.svg
//         // delete numbers & - & extention
//         name = name.replace(/^\d*\-([-\w]+)[.\w]+/, '$1')
//         // delete __new
//         name = name.replace(/([-\w]+)__[\w]+/, '$1')
//         console.log(name)
//         return name;
//      }
//   };
