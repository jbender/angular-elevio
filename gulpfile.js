var gulp     = require('gulp')
, coffee     = require('gulp-coffee')
, coffeelint = require('gulp-coffeelint')
, watch      = require('gulp-watch')
, concat     = require('gulp-concat');

gulp.task('compile-coffee', function () {
  gulp.src([
      './src/elevio.coffee'
    ])
    .pipe(coffeelint('.coffeelint'))
    .pipe(coffeelint.reporter())
    .pipe(coffee({ bare : true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  watch('./src/*.coffee', function (files) {
    gulp.start('compile-coffee');
  });
});

gulp.task('default', ['compile-coffee', 'watch']);
