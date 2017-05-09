'use strict';

// Requires
var gulp = require('gulp'),
    pump = require('pump'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    bs = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    prefix = require('gulp-autoprefixer'),
    concatCSS = require('gulp-concat-css');

// BrowserSync Reload
var reload = bs.reload;

// My Paths
var appRoot = './app/',
    buildRoot = './build/';

var app = {
  js: appRoot + 'js/',
  css: appRoot + 'css/',
  mail: appRoot + '_mail/',
  views: appRoot + 'views/',
  assets: appRoot + '_assets/'
};
var build = {
  js: buildRoot + 'js/',
  css: buildRoot + 'css/',
  img: buildRoot + 'img/',
  mail: buildRoot + 'mail/',
  fonts: buildRoot + 'fonts',
  assets: buildRoot + '_assets/',
};

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
gulp.task('sass', function() {
  return gulp.src(app.css + 'style.scss')
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

// Uglify JS
gulp.task('uglify', function(cb) {
  pump([
      gulp.src(app.js + '*.js'),
      uglify(),
      gulp.dest(build.js)
    ],
    cb
  );
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
// JS Assets
gulp.task('jsAssets', function(cb) {
  pump([
      gulp.src(app.assets + 'js/*.js'),
      uglify(),
      concat('assets.js'),
      gulp.dest(build.js)
    ],
    cb
  );
});
// IMG Assets
gulp.task('images', function(){
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


// Watchers
gulp.task('watch_views', ['views'], reload);

// Default task
gulp.task('default', ['views', 'sass', 'uglify', 'mail', 'cssAssets', 'jsAssets', 'fontAssets', 'images'], function(){
  bs({server: buildRoot});

  // Gulp watches
  gulp.watch(app.views + '**/*.pug', ['watch_views']);
  gulp.watch(app.css + '**/*.scss', ['sass']);
  gulp.watch(app.js + '**/*.js', ['uglify']);
  gulp.watch(app.mail + '*.php', ['mail']);
  gulp.watch(app.assets + '**/*.css', ['cssAssets']);
  gulp.watch(app.assets + '**/*.js', ['jsAssets']);
  gulp.watch(app.assets + 'fonts/*', ['fontAssets']);
  gulp.watch(app.assets + 'img/**/**', ['images']);
});