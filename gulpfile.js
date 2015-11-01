
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');


/* JS Libs */
var js_libs = [
    'ab-client'
];

/* GULP */
gulp.task('js', function() {
    return gulp.src('libs/ab-client.js')
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
    gulp.watch('libs/ab-client.js', ['js']);
});

gulp.task('default', ['watch']);
