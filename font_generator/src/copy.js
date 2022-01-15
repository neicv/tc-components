let fs = require('fs-extra');
let read = require('fs-readdir-recursive');
let path = require('path');

// Setup the instructions on which folders to copy
let copyInstructions = [
	{
		label: 'Copy Fonts',
		source: './dist/',
		destination: './src/fonts/',
        onlyDir: true,
        extractDir: true,
        clearDestDir: true
	},
	{
		label: 'Copy config file',
		source: './dist/',
		destination: './src/js/config/',
        test: /\.config\.json/,
        onlyFiles: true
	},
    {
		label: 'Copy CSS file',
		source: './dist/',
		destination: './src/css/',
        test: /.css/,
        onlyFiles: true
	}
];

// Copy all files
copyInstructions.map(function (instruction) {
	const {label, source, destination, onlyDir = false, extractDir = false, onlyFiles = false , clearDestDir = false, test = ''} = instruction;

    if (label) {
		console.log(label);
	}

    if (clearDestDir) {
        fs.emptyDirSync(destination);
    }

	let files = read(source);

	files.forEach(file => {
        console.log(file)
        if (onlyDir) {
            if (!file.includes('\\')) return;
        }

        if (onlyFiles) {
            if (file.includes('\\')) return;
        }

        if (test){
            if (!file.match(test)) return;
        }

		let sourcePath = source + '/' + file;

        if (extractDir) {
            file = file.replace(/^.*[\\\/]/, '');
        }

		let destinationPath = destination + '/' + file;

		fs.copy(path.resolve(sourcePath), path.resolve(destinationPath), function (err) {
			/*if (label) {
				console.log(label);
			}*/

	    if (err) {
	      return console.error(err);
	    }

	    console.log(`Copied ${file} to ${path.resolve(destinationPath)}`);
		});
	});
});
