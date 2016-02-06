var gulp          = require('gulp'),
    minifycss     = require('gulp-minify-css'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    webpack       = require('gulp-webpack'),
    webpackConfig = require('./webpack.config');

gulp.task('compileEs6', function () {
    return gulp.src('./src/js/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(rename('meplayer.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('copyFont', function () {
    return gulp.src('./src/fontello/fonts/*')
        .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('handleCss', function () {
    return gulp.src(['src/css/*', 'src/fontello/*.css'])
        .pipe(concat('meplayer.css'))
        .pipe(gulp.dest('./dist/'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function () {
    gulp.watch('./src/js/*', ['compileEs6']);
    gulp.watch('./src/css/*', ['handleCss']);
});

gulp.task('default', function () {
    gulp.start('copyFont', 'handleCss', 'compileEs6', 'watch');
});
