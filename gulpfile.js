var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
	gulp.src('./min', { read: false })
		.pipe(clean());
});

gulp.task('prepare-spec', function() {
	gulp.src( [ 'test/shimlib-spec/*.js', 'test/shimlib-integration-spec/*.js' ])
		.pipe(concat('shimlib-spec.browserified.js'))
		.pipe(browserify())
		.pipe(gulp.dest('./min'));
});

gulp.task('prepare-shimlib-standalone', function() {
	gulp.src('app/shimlib.js')
		.pipe(browserify({ standalone: 'shimlib' }))
		.pipe(uglify())
		.pipe(rename('shimlib.min.js'))
		.pipe(gulp.dest('./min'));
});

gulp.task('build', [ 'clean', 'prepare-shimlib-standalone', 'prepare-spec' ]);