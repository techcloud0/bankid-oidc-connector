const path = require( 'upath' );

const gulp = require( 'gulp' );
const changed = require( 'gulp-changed' );
const plumber = require( 'gulp-plumber' );
const rename = require( 'gulp-rename' );
const minifyCSS = require( 'gulp-minify-css' );

const compass = require( 'gulp-compass' );
const autoprefixer = require( 'gulp-autoprefixer' );

const ROOT = '../../../';

const SCSS_SRC_FOLDER = path.resolve( __dirname, ROOT, 'src/main/scss' );
const SCSS_SRC_FILES = path.resolve( __dirname, ROOT, SCSS_SRC_FOLDER, '**/*.scss' );
const SCSS_BUILD_FOLDER = path.resolve( __dirname, ROOT, 'src/main/public/css' );
const SCSS_DIST_FOLDER = path.resolve( __dirname, ROOT, 'dist/css' );
const SCSS_FILE = path.resolve( __dirname, ROOT, 'src/main/scss/oidc-connector.scss' );

gulp.task( 'connector:scss', function () {
    return gulp.src( SCSS_FILE )
        .pipe( changed( SCSS_BUILD_FOLDER, { extension: '.scss' } ) )
        .pipe( plumber() )
        .pipe( compass( {
            css: SCSS_BUILD_FOLDER,
            sass: path.resolve( __dirname, ROOT, SCSS_SRC_FOLDER ),
            sourcemap: true,
            time: true
        } ) )
        .pipe( autoprefixer( {
            browsers: ['ie >= 9', 'last 2 versions', '> 1%', 'Firefox ESR'],
            cascade: false
        } ) )
        .pipe( gulp.dest( SCSS_BUILD_FOLDER ) );
} );

gulp.task( 'connector:scss:watch', ['connector:scss'], function () {
    gulp.watch( SCSS_SRC_FILES, ['connector:scss'] );
} );

gulp.task( 'connector:scss:dist', function () {
    gulp.src( SCSS_FILE )
        .pipe(
            compass( {
                css: SCSS_BUILD_FOLDER,
                sass: path.resolve( SCSS_SRC_FOLDER ),
                time: true,
                environment: 'production'
            } ) )
        .pipe( autoprefixer( {
            browsers: ['ie >= 9', 'last 2 versions', '> 1%', 'Firefox ESR'],
            cascade: false
        } ) )
        .pipe( minifyCSS() )
        .pipe( rename( path => {
            path.basename += '.min';
        } ) )
        .pipe( gulp.dest( SCSS_DIST_FOLDER ) );
} );