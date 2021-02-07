import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import browserSync from "browser-sync";

const PRODUCTION = yargs.argv.prod;

export const compileStyles = () => {
  return src('src/scss/bundle.scss')
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))

    // compile from sass til css
    .pipe(sass().on('error', sass.logError))
    // add vendor profixes
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
    // minify the file
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
    // add source maps
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))

    .pipe(dest('dist/css'));
}

export const compressImages = () => {
  return src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/img'));
}

export const copy = () =>{
  return src(['src/**/*', '!src/{img,js,scss}', '!src/{img,js,scss}/**/*', '!src/bootstrap/scss', '!src/bootstrap/scss/**/*'])
  .pipe(dest('dist'));
}

export const clean = () => del(['dist']);

export const scripts = () => {
  return src('src/js/bundle.js')
  .pipe(webpack({
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: []
            }
          }
        }
      ]
    },
    mode: PRODUCTION ? 'production' : 'development',
    devtool: !PRODUCTION ? 'inline-source-map' : false,
    output: {
      // we need to specify a file name, otherwise webpack will generate
      // a bundle with a hash as the filename
      filename: 'bundle.js'
    },
  }))
  .pipe(dest('dist/js'));
}


// Refreshing the browser with Browsersync
const server = browserSync.create();
export const serve = done => {
  server.init({
    // put your local website link here:
    proxy: "http://192.168.68.101:8888/nestojosa/" 
  });
  done();
};
export const reload = done => {
  server.reload();
  done();
};


export const watchForChanges = () => {
  watch('src/scss/**/*.scss', series(compileStyles, reload));
  watch('src/img/**/*.{jpg,jpeg,png,svg,gif}', series(compressImages, reload));
  watch('src/js/**/*.js', series(scripts, reload));
  watch(['src/**/*','!src/{scss,img,js,}','!src/{scss,img,js}/**/*'], series(copy, reload));
  watch('**/*.php', reload); 
}

export const dev = series(clean, parallel(compileStyles, compressImages, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(compileStyles, compressImages, copy, scripts));
export default dev;
