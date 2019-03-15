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
    .pipe(dest('dist/'))
}

function fonts() {
  return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'))
}

function css() {
  return src('src/sass/main.sass')
    .pipe(sass())
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

function js() {
  return src([
    'src/libs/jquery/dist/jquery.min.js',
    'src/js/*.js'
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }))
}

function bsServer() {
  browserSync({
			server: {
				baseDir: 'dist'
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
	watch(['src/js/*.js'], js);
	watch('src/*.html', html);
}

async function removeDist() {
  return await del.sync('dist');
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.removeDist = removeDist;
exports.build = series(removeDist, html, fonts, css, js, imgMin);
exports.default = parallel(bsServer, watching);