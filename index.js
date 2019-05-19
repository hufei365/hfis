
const fis = module.exports = require('fis3');
require('colors');

fis.require.prefixes.unshift([ 'hfis' ]);



fis.cli.name 		  = 'hfis';

fis.cli.version 	  = require('./version.js');

fis.cli.info 		  = fis.util.readJSON( __dirname + '/package.json' );

fis.cli.help.commands = [ 'release', 'install', 'server', 'inspect' ];
