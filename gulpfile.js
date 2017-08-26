'use scrict';

// Requires
var gulp = require('gulp'),
    pump = require('pump'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    bs = require('browser-sync'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    prefix = require('gulp-autoprefixer'),
    concatCSS = require('gulp-concat-css'),
    sourcemaps = require('gulp-sourcemaps');

// BrowserSynce Reload
var reload = bs.reload;

// My Paths
var appRoot = './app/',
    buildRoot = './public/';

var app = {
  js: appRoot + 'js/',
  css: appRoot + 'css/',
  mail: appRoot + '_mail/',
  views: appRoot + 'views/',
  posts: appRoot + 'posts/',
  assets: appRoot + '_assets/'
};
var build = {
  js: buildRoot + 'js/',
  css: buildRoot + 'css/',
  img: buildRoot + 'img/',
  mail: buildRoot + 'mail/',
  fonts: buildRoot + 'fonts',
  posts: buildRoot + 'posts/',
  assets: buildRoot + '_assets/',
};

// ------- Tasks ------- //

// View Task
gulp.task('views', function() {
  return gulp.src(app.views + '*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(buildRoot))
});

// Sass Task
gulp.task('sass', ['images'], function() {
  return gulp.src(app.css + 'main.scss')
    .pipe(plumber())
    .pipe(sass.sync({
      outputStyle: 'compressed'
    }))
    .pipe(prefix({ browsers: ['last 4 versions'] }))
    .pipe(gulp.dest(build.css))
    .pipe(reload({
      stream: true
    }));
});

// JS Task
gulp.task('js', function() {
  return gulp.src(app.js + '*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(build.js))
});

// Mail PHP
gulp.task('mail', function() {
  return gulp.src(app.mail + '*.php')
    .pipe(gulp.dest(build.mail))
});

// Font Assets
gulp.task('fontAssets', function() {
  return gulp.src(app.assets + 'fonts/*')
    .pipe(gulp.dest(build.fonts))
})
// CSS Assets
gulp.task('cssAssets', function() {
  return gulp.src(app.assets + 'css/*.css')
    .pipe(cleanCSS())
    .pipe(concatCSS('assets.css'))
    .pipe(gulp.dest(build.css))
});
// JS Task
gulp.task('jsAssets', function() {
  return gulp.src(app.assets + 'js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('assets.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(build.js))
});

// IMG Assets
gulp.task('images', ['cleanImgs'], function(){
  return gulp.src(app.assets + 'img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(gulp.dest(build.img))
    .pipe(reload({ stream: true}));
});
// Clean Images
gulp.task('cleanImgs', function() {
  return gulp.src(build.img + 'img', {read: false})
    .pipe(clean());
});

// Watchers
gulp.task('watch_views', ['views'], reload);

gulp.task('clean', function() {
  return gulp.src(buildRoot)
    .pipe(clean());
});

// Default task
gulp.task('default', ['views', 'sass', 'js', 'mail', 'cssAssets', 'jsAssets', 'fontAssets'], function() {

  bs({server: buildRoot});

  // Gulp Watchers
  gulp.watch(app.views + '**/*.pug', ['watch_views']);
  gulp.watch(app.css + '**/*.scss', ['sass']);
  gulp.watch(app.js + '**/*.js', ['js']);
  gulp.watch(app.mail + '*.php', ['mail']);
  gulp.watch(app.assets + '**/*.css', ['cssAssets']);
  gulp.watch(app.assets + '**/*.js', ['jsAssets']);
  gulp.watch(app.assets + 'fonts/*', ['fontAssets']);
  gulp.watch(app.assets + 'img/**/**', ['images']);
});