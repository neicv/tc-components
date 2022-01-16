const { renameIcons } = require('../src/utils');

module.exports = {
    'files': [
      '../fonts/editor/*.svg'
    ],
    'cssFontsUrl': './fonts/',
    'fontName': 'turboeditor',
    'classPrefix': 'editor-icon.',
    'baseSelector': '.editor-icon',
    'types': ['eot', 'woff', 'ttf'],
    'fileName': 'turboeditor/[fontname].[ext]',
    'startCodepoint': 0xE001,
    'rename': renameIcons,
  };
