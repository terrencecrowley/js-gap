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

var testConfig = {
	entry: './tests.ts',
	target: 'node',
	output: {
		path: './testdist',
		filename: 'test.bundle.js'
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

var libConfig = {
	entry: './lib/gap.ts',
	target: 'node',
	output: {
		path: './dist/lib',
		filename: 'gap.js'
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

module.exports = [ testConfig, libConfig ];
