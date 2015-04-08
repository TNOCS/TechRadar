/// <vs SolutionOpened='default' />
// http://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp
// http://www.smashingmagazine.com/2014/06/11/building-with-gulp/

var gulp      = require('gulp'),
    insert    = require('gulp-insert'),
    uglify    = require('gulp-uglify'),
    minifyCss = require('gulp-cssmin'),
    rename    = require('gulp-rename'),
    cache     = require('gulp-cached'),
    concat    = require('gulp-concat'),
    plumber   = require('gulp-plumber'),
    useref    = require('gulp-useref'),
    gulpif    = require('gulp-if'),
    watch     = require('gulp-watch');


gulp.task('debug-built', function() {
    var assets = useref.assets();

    return gulp.src('./public/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('release-built', function() {
    var assets = useref.assets();

    return gulp.src('./public/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('convertTemplates2Ts', function() {
    gulp.src('./**/*.tpl.html')
        .pipe(plumber())
        .pipe(cache('templates'))
        .pipe(insert.prepend(function(file) {
            var filename = file.path.substring(file.path.lastIndexOf('\\') + 1, file.path.lastIndexOf('.tpl.html'));
            return 'module ' + filename + ' { export var html = \'';
        }))
        .pipe(insert.append('\'; }'))
        .pipe(insert.transform(function(contents) {
            return contents.replace(/(\r\n|\n|\r)/gm, "");
        }))
        .pipe(rename({ extname: '.ts' }))
        .pipe(gulp.dest('./'));
});

// // JS hint task
// gulp.task('lint', function() {
//     gulp.src('./*.js')
//         .pipe(plumber())
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });
//
//
// // gulp.task('minify', function () {
// //    gulp.src('../csComp/dist/csComp.js')
// //       .pipe(uglify())
// //       .pipe(gulp.dest('build/csComp.min.js'))
// // });
//
// // gulp.task('minify', function () {
// //    gulp.src('../csComp/dist/csComp.js')
// //       .pipe(insert.prepend('/// <reference path="../leaflet/leaflet.d.ts" />'))
// //       .pipe(uglify())
// //       .pipe(rename({suffix: '.min.js'}))
// //       .pipe(gulp.dest('build'))
// // });
//
// gulp.task('convertTemplates2Ts', function() {
//     gulp.src('../../../csWeb/csComp/**/*.tpl.html')
//         .pipe(plumber())
//         .pipe(cache('templates'))
//         .pipe(insert.prepend(function(file) {
//             var filename = file.path.substring(file.path.lastIndexOf('\\') + 1, file.path.lastIndexOf('.tpl.html'));
//             return 'module ' + filename + ' { export var html = \'';
//         }))
//         .pipe(insert.append('\'; }'))
//         .pipe(insert.transform(function(contents) {
//             return contents.replace(/(\r\n|\n|\r)/gm, "");
//         }))
//         .pipe(rename({ extname: '.ts' }))
//         .pipe(gulp.dest('../../../csWeb/csComp'));
// });
//
// gulp.task('minify_csComp', function () {
//     gulp.src('../../../csWeb/csComp/dist/csComp.js')
//       .pipe(plumber())
//       .pipe(uglify())
//       .pipe(rename({ suffix: '.min' }))
//       .pipe(gulp.dest('public/js/cs'));
//     gulp.src('../../../csWeb/csComp/dist/csComp.js')
//       .pipe(plumber())
//       .pipe(gulp.dest('public/js/cs'));
// });
//
// gulp.task('copy_csComp', function() {
//     gulp.src('../../../csWeb/csComp/dist/csComp.js')
//         .pipe(plumber())
//         .pipe(gulp.dest('public/js/cs'));
// });
//
// gulp.task('copy_csServerComp', function() {
//     gulp.src('../../../csWeb/csServerComp/dist/csServerComp.js')
//         .pipe(plumber())
//         .pipe(gulp.dest('js/cs'));
// });
//
// gulp.task('minify_csServerComp', function() {
//     gulp.src('../../../csWeb/csServerComp/dist/csServerComp.js')
//         .pipe(plumber())
//         .pipe(uglify())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('js/cs'))
// });
//
// gulp.task('addref_csComp', function() {
//     gulp.src('../../../csWeb/csComp/dist/csComp.d.ts')
//         .pipe(plumber())
//         .pipe(insert.prepend('/// <reference path="../leaflet/leaflet.d.ts" />\r\n'))
//         .pipe(insert.prepend('/// <reference path="../crossfilter/crossfilter.d.ts" />\r\n'))
//         .pipe(gulp.dest('Scripts/typings/cs'));
// });
//
// gulp.task('addref_csServerComp', function() {
//     gulp.src('../../../csWeb/csServerComp/dist/csServerComp.d.ts')
//         .pipe(plumber())
//         .pipe(insert.prepend('/// <reference path="../leaflet/leaflet.d.ts" />\r\n'))
//         .pipe(gulp.dest('Scripts/typings/cs'));
// });
//
// gulp.task('include_js', function() {
//     gulp.src('../../../csWeb/csComp/includes/js/*.js')
//         //.pipe(concat('includes.js'))
//         //.pipe(uglify())
//         //.pipe(rename({suffix: '.min'}))
//         .pipe(plumber())
//         .pipe(gulp.dest('./public/js/cs'));
// });
//
// gulp.task('include_css', function() {
//     gulp.src('../../../csWeb/csComp/includes/*.css')
//         //.pipe(concat('includes.js'))
//         .pipe(plumber())
//         .pipe(gulp.dest('./public/css'));
// });
//
// gulp.task('include_images', function() {
//     gulp.src('../../../csWeb/csComp/includes/images/*.*')
//         .pipe(plumber())
//         .pipe(gulp.dest('./public/includes/images/'));
// });
//
// gulp.task('watch', function () {
//     gulp.watch('../../../csWeb/csComp/**/*.tpl.html', ['convertTemplates2Ts']);
//     gulp.watch('../../../csWeb/csComp/dist/*.d.ts', ['addref_csComp', 'copy_csComp']);
//     gulp.watch('../../../csWeb/csServerComp/dist/*.d.ts', ['addref_csServerComp', 'copy_csServerComp']);
//     gulp.watch('../../../csWeb/csComp/includes/*.*', ['include_js','include_css']);
//     gulp.watch('../../../csWeb/csComp/includes/images/*.*', ['include_images']);
// });
//
// gulp.task('default', ['addref_csComp', 'addref_csServerComp', 'copy_csComp', 'copy_csServerComp', 'convertTemplates2Ts', 'include_js','include_css','include_images','watch']);
