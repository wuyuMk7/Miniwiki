'use strict'

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();
var merge = require('merge-stream');
var del = require('del');

/**
 * Build scripts
 */
gulp.task('build:typescript', () => {
  return gulp.src(['app/client/app/**/*.ts','typings/main', 'node_modules/angular2/typings/browser.d.ts'])
    .pipe((tsc.createProject('./tsconfig.json')()))
    .js
    //.pipe(uglify())
    .pipe(gulp.dest("public/dist/js"));
});

gulp.task('build:libs', () => {
  return gulp.src([
      'node_modules/rxjs/bundles/Rx.min.js',
      //'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
    ])
    .pipe(gulp.dest("public/js"));
});

/**
 * Uglify scripts
 */
gulp.task('compress', ['build:typescript', 'build:libs'], () => {
  /**
   * Specify the files needed compress.
   *
   * var bundle = gulp.src('public/dist/js/*.js')
   *   .pipe(uglify({ preserveComments: 'license' }))
   *   .pipe(gulp.dest('public/dist/js'));
   * var libs = gulp.src('public/js/*.js')
   *   .pipe(uglify({ preserveComments: 'license' }))
   *   .pipe(gulp.dest('public/js'));
   *
   * return merge(bundle, libs);
   */

  return gulp.src(['public/**/*.js', '!public/**/*.min.js'])
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(gulp.dest('public'));
});

/**
 * Build CSS
 */
gulp.task('build:css', () => {});

/**
 * Build Templates
 */
gulp.task('build:template', () => {
  var index = gulp.src(['app/client/app/components/**/*.html']).pipe(gulp.dest("public/dist/templates"));
  var template = gulp.src('app/client/index.html').pipe(gulp.dest('public'))

  return merge(index, template);
});


/**
 * Dev Server scripts
 */
gulp.task('nodemon', ['build:libs', 'build:typescript', 'build:template', 'build:css'], () => {
  nodemon({
    script: 'app/server/server.js',
    ext: 'js',
    ignore: ['app/client', 'public/'],
    //tasks: () => { return []; }
  });
});
gulp.task('dev:frontend', ['nodemon'], () => {
  browserSync.init(null, { proxy: "localhost:4000" });
  gulp.watch('app/client/app/**/*.ts', ['build:typescript']);
  gulp.watch('app/client/app/**/*.scss', ['build:css']);
  gulp.watch(['app/client/index.html', 'app/client/app/components/**/*.template.html'], ['build:template']);
  gulp.watch('public/**', browserSync.reload);
});
gulp.task('dev:backend', ['nodemon'], () => {});

gulp.task('dev', ['dev:frontend', 'dev:backend', 'nodemon'], () => {
  console.log('Dev Server Running...');
});

/**
 * Clean scripts
 */
gulp.task('clean:typescript', () => { del('public/dist/js/*') });
gulp.task('clean:libs', () => { del('public/js/*') });
gulp.task('clean:css', () => { del('public/dist/css/*') });
gulp.task('clean:templates', () => { del('public/dist/templates/*') });
gulp.task('clean:all', () => { del('public/*') });
gulp.task('clean', ['clean:typescript', 'clean:libs', 'clean:css', 'clean:templates'], () => {});
