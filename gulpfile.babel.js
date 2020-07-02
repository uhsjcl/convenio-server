import gulp from 'gulp';
import typescript from 'gulp-typescript';
import merge from 'merge-stream';
import del from 'del';

const dir = {
  src: 'src',
  build: 'build'
};

gulp.task('move_vars', () => {
  try {
    return gulp.src('.env')
    .pipe(gulp.dest('build'));
  } catch (e) {
    console.error('Please fill out the environment variable file. Copy env stub file to .env and fill out the file.')
    return;
  }
});

gulp.task('clean', () => del([ dir.build ]))

gulp.task('server', () => {
  let entry = gulp.src(`${dir.src}/index.ts`)
    .pipe(typescript(require('./tsconfig.json').compilerOptions))
	.pipe(gulp.dest(`${dir.build}/${dir.src}`));
  let everything_else = gulp.src('./*(!(node_modules|tests))/**/*.ts')
    .pipe(typescript(require('./tsconfig.json').compilerOptions))
    .pipe(gulp.dest(`${dir.build}`));
  return merge(entry, everything_else);
});

gulp.task('default', gulp.series('clean', 'server', 'move_vars'));
