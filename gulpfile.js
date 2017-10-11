const gulp = require('gulp');
const fs = require('fs');
const compiler = require('google-closure-compiler-js').gulp();
const zopfli = require("gulp-zopfli");
const externsfile = 'closure-externs.js';

gulp.task('compile', function() {
  return gulp.src('miq.js', {base: './'})
      .pipe(compiler({
          jsOutputFile: 'miq-min.js',
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT6',
          compilationLevel: 'ADVANCED',
          warningLevel: 'QUIET',
          createSourceMap: true,
          externs: [{src: fs.readFileSync(externsfile, 'utf-8'), path: externsfile}]
      }))
      .pipe(gulp.dest('./'));
});


gulp.task("compress", function() {
    gulp.src('miq-min.js')
        .pipe(zopfli())
        .pipe(gulp.dest('./'));
});

gulp.task("default", function() {
    gulp.run("compile");
    gulp.run("compress");
});
