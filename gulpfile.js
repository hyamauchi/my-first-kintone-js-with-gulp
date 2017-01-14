var fs         = require('fs');
var gulp       = require('gulp');
var netlify    = require('gulp-netlify');
var AWS        = require('aws-sdk/global');
var awspublish = require('gulp-awspublish');
var webserver  = require('gulp-webserver');
var concat     = require("gulp-concat");
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var gulpUtil   = require('gulp-util');

var paths = {
  srcDir: 'src',
  distDir: 'dist'
};
var srcGlob = paths.srcDir + '/**/*';

gulp.task('netlify', function () {
  var key = JSON.parse(fs.readFileSync('./netlify.json'));
  return gulp.src(srcGlob)
    .pipe(netlify(key));
});

gulp.task('s3publish', ['jsbuild'], function () {
  var key = JSON.parse(fs.readFileSync('./aws.json'));
  key.credentials = new AWS.SharedIniFileCredentials();
  var publisher = awspublish.create(key);
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src(paths.distDir + '/**/*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('jsbuild', function () {
  return gulp.src(paths.srcDir + '/**/*.js')
    .pipe(concat('build.js'))
    .pipe(uglify({preserveComments: 'some'}).on('error', gulpUtil.log))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.distDir + '/'));
});

gulp.task('webserver', function () {
  gulp.src(paths.srcDir)
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('default', ['s3publish']);
