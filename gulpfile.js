// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    watch = require('gulp-watch'),
    cmq = require('gulp-combine-media-queries'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    server = lr();

/* 
 * Handle error to avoid break or sending a scss file in css folder
 * https://github.com/gulpjs/gulp/issues/259
*/
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

  // Sass
  gulp.task('sass', function() {
      return gulp.src('sass/main.scss')
        .pipe(plumber({
          errorHandler: handleError
        }))
        .pipe(sass({ 
          style: 'expanded',
          noCache: true
        }))
        .pipe(plumber.stop())        
        .pipe(gulp.dest('css'))
  });

  // Postprocess
  gulp.task('postprocess', function() {
    return gulp.src('css/main.css')
      .pipe(cmq())
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('css'))
      .pipe(minifycss())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('css'))
      .pipe(livereload(server));
  });

  // Scripts
  gulp.task('scripts', function() {  
      return gulp.src(['js/*.js', '!js/vendor/**', '!js/main.min.js'])
          .pipe(concat('main.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('js/'))
          .pipe(livereload(server));
  });

  // Images
  gulp.task('images', function() {
    return gulp.src(['img/original/*.png', 'img/original/*.jpg'])
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('img/'))
      .pipe(livereload(server));
  });

  gulp.task('glyphicons', function() {
   gulp.src('img/svg/*')
      .pipe(iconfontCss({
        fontName: 'fonticon', // nom de la fonte, doit être identique au nom du plugin iconfont
        path: 'css',
        targetPath: '../../sass/_fonts.scss', // emplacement de la css finale
        fontPath: 'fonts/' // emplacement des fontes finales
      }))
      .pipe(iconfont({
        fontName: 'fonticon' // identique au nom de iconfontCss
       }))
      .pipe(gulp.dest('css/fonts/') )
  })


  // Default task
  gulp.task('default', function() {
      // Listen on port 35729
      server.listen(35729, function (err) {
        if (err) {
          return console.log(err)
        };

      // Watch .scss files
      gulp.watch('sass/*.scss', ['sass']);

      // Watch main.css files
      gulp.watch('css/main.css', ['postprocess']);

      // Watch .js files
      gulp.watch('js/*.js', ['scripts']);

      // Watch image files
      gulp.watch('img/original/*', ['images']);
  });



});