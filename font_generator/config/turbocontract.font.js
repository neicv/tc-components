const { renameIcons } = require('../src/utils');

module.exports = {
    'files': [
      '../fonts/turbo/*.svg'
    ],
    'fontName': 'Turbocontract',
    'classPrefix': 'font-icon.',
    'baseSelector': '.font-icon',
    'types': ['eot', 'woff', 'ttf'],
    'fileName': 'Turbocontract/[fontname].[ext]',
    'startCodepoint': 0xE001,
    'rename':  renameIcons
  };
