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
    cleanCSS = require('gulp-clean-css'),
    concatCSS = require('gulp-concat-css');

// BrowserSync Reload
var reload = bs.reload;

// My Paths
var app = {
  js: 'app/js/',
  css: 'app/css/',
  mail: 'app/_mail/',
  views: 'app/views/',
  assets: 'app/_assets/'
};
var build = {
  src: 'build/',
  js: 'build/js/',
  css: 'build/css/',
  mail: 'build/mail/',
  fonts: 'build/fonts',
  assets: 'build/_assets/',
};

// View Task
gulp.task('views', function() {
  return gulp.src(app.views + '*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(build.src))
});

// Sass Task
gulp.task('sass', function() {
  return gulp.src(app.css + 'style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
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


// Watchers
gulp.task('watch_views', ['views'], reload);

// Default task
gulp.task('default', ['views', 'sass', 'uglify', 'mail', 'cssAssets', 'jsAssets', 'fontAssets'], function(){
  bs({server: build.src});

  // Gulp watches
  gulp.watch(app.views + '**/*.pug', ['watch_views']);
  gulp.watch(app.css + '**/*.scss', ['sass']);
  gulp.watch(app.js + '**/*.js', ['uglify']);
  gulp.watch(app.mail + '*.php', ['mail']);
  gulp.watch(app.assets + '**/*.css', ['cssAssets']);
  gulp.watch(app.assets + '**/*.js', ['jsAssets']);
  gulp.watch(app.assets + 'fonts/*', ['fontAssets']);
});