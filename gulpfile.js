const { watch, src, dest, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const del = require('del');

function html() {
  return src('src/*.html')
    .pipe(browserSync.reload({ stream: true }))
}

function fonts() {
  return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'))
}

function css() {
  return src('src/sass/main.sass')
    .pipe(sass())
    .pipe(rename({basename: "style", suffix: '.min'}))
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
}

function js() {
  return src([
    'src/libs/jquery/dist/jquery.min.js',
    'src/js/common.js'
  ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.reload({ stream: true }))
}

function bsServer() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  }); 
}

function imgMin() {
	return src('src/img/**/*')
	.pipe(imagemin())
	.pipe(dest('dist/img'));
}

function watching() {
	watch('src/sass/*.sass', css);
	watch(['src/js/common.js'], js);
	watch('src/*.html', html);
}

async function remove() {
  return await del.sync('dist');
}

function moveCss() {
  return src('src/css/*.css')
  .pipe(dest('dist/css'))
}

function moveJs() {
  return src('src/js/script.min.js')
  .pipe(dest('dist/js'))
}

function moveHtml() {
  return src('src/*.html')
    .pipe(dest('dist/'))
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.remove = remove;
exports.build = series(remove, moveHtml, css, js, fonts, imgMin, moveCss, moveJs);
exports.default = parallel(bsServer, css, js, watching);