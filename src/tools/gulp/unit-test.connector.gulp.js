const gulp = require( 'gulp' );
const path = require( 'upath' );

const ROOT = path.resolve( __dirname, '../../../' );

const Server = require( 'karma' ).Server;

gulp.task( 'connector:test:unit', done => {
    new Server( {
        configFile: path.resolve( ROOT, 'karma.conf.js' ),
        singleRun: true
    }, done ).start();
} );