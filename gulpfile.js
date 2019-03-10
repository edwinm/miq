const gulp = require('gulp');
const fs = require('fs');
const compiler = require('google-closure-compiler').gulp();
const zopfli = require("gulp-zopfli-green");
const externsfile = 'closure-externs.js';

gulp.task('compile', function (done) {
	return gulp.src('./miq.js', {base: './'})
		.pipe(compiler({
			compilation_level: 'ADVANCED',
			warning_level: 'VERBOSE',
			language_in: 'ECMASCRIPT6_STRICT',
			language_out: 'ECMASCRIPT6_STRICT',
			js_output_file: 'miq-min.js',
			create_source_map: true,
			externs: externsfile
		}))
		.pipe(gulp.dest('./'));
	done();
});

gulp.task('compress', function(done) {
    gulp.src('./miq-min.js')
        .pipe(zopfli())
        .pipe(gulp.dest('./'));
    done();
});

	exports.default = gulp.series('compile', 'compress');
