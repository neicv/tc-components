# tc-components
Test new Components and Documentation for TC system based on Mithril.js

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

## Usage

### Build-in Font Generator

Font Generator generates fonts from your SVG icons and allows you to use icons in this project.

`Font Generator` uses the [`webfonts-loader`](https://github.com/jeerbl/webfonts-loader) plugin to create fonts in any format. It also generates CSS files so that you can use your icons directly in your HTML, using CSS classes.

See additonal information on [`webfonts-loader`](https://github.com/jeerbl/webfonts-loader)

### The font configuration file

#### Description

The config file allows you to specify parameters for the loader to use. Here is an example configuration file:

```javascript
module.exports = {
    'files': [
      '../fonts/font-one/*.svg'
    ],
    'fontName': 'font-one',
    'classPrefix': 'font-one.',
    'baseSelector': '.font-one',
    'types': ['eot', 'woff', 'woff2', 'ttf'],
    'fileName': 'font-one/[fontname].[ext]',
    'cssFontsUrl': '../fonts/'
    'startCodepoint': 0xD101
  };
```

Each Fonts must have configuration file.

Place in .\font_generator\config

The autoloader will then generate:

* CSS with the base and class prefix
* Font files for the SVG icons


#### Steps for prepare generation fonts

* `Step 1`: in root directory `font_generator` make dir `fonts` (or use it if exist)
* `Step 2`: in this `fonts` directory create subfolder for each font you make
* `Step 3`: copy your icons set to subfolders
```
font_generator
│
└───fonts
    └───font-one
    │   │   icon-01.svg
    │   │   icon-02.svg
    │   │   ...
    │
    └───font-two
        │   icon-01.svg
        │   icon-02.svg
        │   ...
```
* `Step 4`: execute font generate `npm run makefont`
* `Step 5`: All generated Fonts you can see in in root project directory `.\src\fonts`

##### `Generated files`, CSS and Config

* `font-icons.css`: fonts CSS file placed in `.src\css`
* `font-icons.config.js`: fonts Config file placed in `.src\js\config`

### Generates fonts from your SVG

```
npm run makefont
```


## Standarts
[![](https://github.com/neicv/tc-components/workflows/EditorConfig/badge.svg)](https://github.com/neicv/tc-components/actions?query=workflow%3AEditorConfig)
![Node.js CI](https://github.com/JedWatson/classnames/workflows/Node.js%20CI/badge.svg)
