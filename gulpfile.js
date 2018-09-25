var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();

const handlebars = require('gulp-compile-handlebars');

// Static Server + watching scss/html/js files
gulp.task('serve', ['html', 'minify', 'sass'], function () {

    browserSync.init({
        server: './public'
    });

    gulp.watch('public/*.html');
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        //.pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

// Minify javascript
gulp.task('scripts', function () {
    gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))

});

// Compile .hbs into .html
gulp.task('html', () => {
  return gulp.src('./src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./src/'));
});

// Minify HTML 
gulp.task('minify', ['html'], function() {
    return gulp.src('src/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('public/'));
  });

// Compress images
gulp.task('image', function () {
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/img'));
});

// Copy font-awesome fonts to public folders
gulp.task('fonts', function () {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('public/fonts'))
})

// Default task
gulp.task('default', ['serve']);
