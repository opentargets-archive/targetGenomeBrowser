
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var sass = require("gulp-sass");

// gulp helper
var gzip = require('gulp-gzip');
var del = require('del');
var rename = require('gulp-rename');

// path tools
var path = require('path');
var join = path.join;
var mkdirp = require('mkdirp');

// browserify build config
var buildDir = "build";
var browserFile = "browser.js";
var packageConfig = require('./package.json');
var outputFile = packageConfig.name;

// auto config for browserify
var outputFileSt = outputFile + ".js";
var outputFilePath = join(buildDir,outputFileSt);
var outputFileMinSt = outputFile + ".min.js";
var outputFileMin = join(buildDir,outputFileMinSt);

gulp.task('default', ['lint', 'build-browser', 'build-browser-gzip']);

gulp.task('sass', function () {
    return gulp.src('./index.scss')
	.pipe(sass())
	.pipe(gulp.dest(buildDir));
});

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js','./src/**/scss/*.scss'], ['build-browser', 'lint']);
});


// will remove everything in build
gulp.task('clean', function() {
    return del([buildDir]);
});

// just makes sure that the build dir exists
gulp.task('init', ['clean'], function() {
  mkdirp(buildDir, function (err) {
    if (err) console.error(err);
  });
});

// browserify debug
gulp.task('build-browser',['init', 'sass'], function() {
  return gulp.src(browserFile)
  .pipe(browserify({debug:true}))
  .pipe(rename(outputFileSt))
  .pipe(gulp.dest(buildDir));
});

// browserify min
gulp.task('build-browser-min',['init', 'sass'], function() {
  return gulp.src(browserFile)
  .pipe(browserify({}))
  .pipe(uglify())
  .pipe(rename(outputFileMinSt))
  .pipe(gulp.dest(buildDir));
});

gulp.task('build-browser-gzip', ['build-browser-min', 'sass'], function() {
  return gulp.src(outputFileMin)
    .pipe(gzip({append: false, gzipOptions: { level: 9 }}))
    .pipe(rename(outputFile + ".min.gz.js"))
    .pipe(gulp.dest(buildDir));
});
