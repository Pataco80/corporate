// VARIABLES
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin');

/*

injectPartials = require('gulp-inject-partials');
minify = require('gulp-minify');
rename = require('gulp-rename');
cssmin = require('gulp-cssmin');
htmlmin = require('gulp-htmlmin');
browserify = require('gulp-browserify');
merge = require('merge-stream');
*/

var SOURCEPATHS = {
  htmlSource : 'src/*.html',
  sassSource : 'src/scss/*.scss',
  jsSource :   'src/js/**',
  imgSource :  'src/img/**'
}
var APPPATHS = {
  root :'app/',
  css : 'app/css',
  js :  'app/js',
  fonts:'app/fonts',
  img : 'app/img'
}

// TASKS
//Clean Html
gulp.task('clean-html', function(){
  return gulp.src(APPPATHS.root + '/*.html', {read:false, force:true})
  .pipe(clean())
});

//Clean Scripts
gulp.task('clean-scripts', function(){
  return gulp.src(APPPATHS.js + '/*.js', {read:false, force:true})
  .pipe(clean())
});

// Styles
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATHS.css))
});

//Images
gulp.task('images', function(){
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATHS.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATHS.img))
});
// Move fonts
gulp.task('moveFonts', function(){
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(APPPATHS.fonts))
});

// Copy
gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPPATHS.root))
});

// Server reload
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATHS.root + '/*.html', APPPATHS.css + '/*.css', APPPATHS.js + '/*.js'],{
    server: {
      baseDir : APPPATHS.root
    }
  })
});

//Watch
gulp.task('watch', ['serve', 'copy', 'sass', 'scripts', 'images', 'moveFonts'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.jsSource], ['images']);
});
// Default
gulp.task('default', ['watch']);
