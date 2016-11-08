var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  	.filter(function(x) {
   		return ['.bin'].indexOf(x) === -1;
	})
	.forEach(function(mod) {
		nodeModules[mod] = 'commonjs ' + mod;
});

var serverConfig = {
	entry: './tests.ts',
	target: 'node',
	output: {
		path: './dist',
		filename: 'server.bundle.js'
	},
	externals: nodeModules,

	// Enable source maps
	devtool: "source-map",

	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},

	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.json$/, loader: 'json-loader' }
		],

		preLoaders: [
			{ test: /\.js$/, loader: "source-map-loader" }
		]
	}
};

module.exports = [ serverConfig ];
