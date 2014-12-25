'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js'] ,function () {
  gulp.watch('app/styles/**/*.scss', ['injector:css']);
  gulp.watch('app/scripts/**/*.js', ['injector:js']);
  gulp.watch('app/{img, images}/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
