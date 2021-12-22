const gulp = require('gulp');
const { series } = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

function lint() {
    return gulp.src(['test/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
}

function test() {
    return gulp.src('test/*.js', {read: false})
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'list'}));
}

exports.default = series(lint, test)