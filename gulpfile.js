var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var paths = {
	outputDir: 'min',
	shimlibSpecs: [ 'test/shimlib-spec/*.js', 'test/shimlib-integration-spec/*.js' ],
	shimlibModule: 'app/shimlib.js',
};

gulp.task('clean', function() {
	gulp.src(paths.outputDir, { read: false })
		.pipe(clean());
});

gulp.task('prepare-spec', function() {
	gulp.src(paths.shimlibSpecs)
		.pipe(concat('shimlib-spec.browserified.js'))
		.pipe(browserify())
		.pipe(gulp.dest(paths.outputDir));
});

gulp.task('prepare-shimlib-standalone', function() {
	gulp.src(paths.shimlibModule)
		.pipe(browserify({ standalone: 'shimlib' }))
		.pipe(uglify())
		.pipe(rename('shimlib.min.js'))
		.pipe(gulp.dest(paths.outputDir));
});

gulp.task('build', [ 'clean', 'prepare-shimlib-standalone', 'prepare-spec' ]);