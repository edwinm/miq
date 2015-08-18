// To minify, make sure the latest Java JDK is installed
// and compiler.jar is copied from node_modules/closure-compiler/lib/vendor
// to closure-compiler/build

module.exports = function (grunt) {
	grunt.initConfig({
		//pkg: grunt.file.readJSON('package.json'),
		'closure-compiler': {
			frontend: {
				closurePath: 'closure-compiler',
				js: 'anise.js',
				jsOutputFile: 'anise-min.js',
				maxBuffer: 500,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS',
					warning_level: 'QUIET'
				}
			}
		},
		'watch': {
			files: ['anise.js'],
			tasks: ['closure-compiler']
		}
	});

	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['closure-compiler']);
};