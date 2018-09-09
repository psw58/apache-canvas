// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function() {
    gulp.src('./www/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./www/css/"))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('./www/sass/*.scss', ['sass']);
})