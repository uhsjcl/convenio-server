import gulp from 'gulp';
import typescript from 'gulp-typescript';
import merge from 'merge-stream';
import del from 'del';

const dir = {
  src: 'src',
  build: 'dist'
};

gulp.task('clean build destination', () => del([ dir.build ]));

gulp.task('source environment files', () => {
  let result;
  try {
    result = gulp.src('.env').pipe(gulp.dest(`${dir.build}`));
  } catch (e) {
    gulp.src('.template.env').pipe(gulp.dest('.env'));
    console.error(`Could not find environment file. Copying .template.env to .env - please fill this file out then run again.`);
    return;
  }
});

gulp.task('source docker environment files', () => {
  let result;
  try {
    result = gulp.src('.docker.env').pipe(gulp.dest(`${dir.build}`));
  } catch (e) {
    gulp.src('.docker.template.env').pipe(gulp.dest('.docker.env'));
    console.error(`Could not find Docker environment file (.docker.env). Copying .docker.template.env to .docker.env - please fill this file out then run again.`);
    return;
  }
});

gulp.task('build server', () => {
  let entry = gulp.src(`${dir.src}/bot.ts`)
    .pipe(typescript(require('./tsconfig.json').compilerOptions))
    .pipe(gulp.dest(`${dir.build}/${dir.src}`));
  let flat_files = gulp.src(`${dir.src}/**/*.json`)
    .pipe(gulp.dest(`${dir.build}/${dir.src}`));
  let everything_else = gulp.src('./*(!(node_modules|prod_modules|tests|.git))/**/*.ts')
    .pipe(typescript(require('./tsconfig.json').compilerOptions))
    .pipe(gulp.dest(`${dir.build}`));
  return merge(entry, flat_files, everything_else);
});

gulp.task('default', gulp.series('clean build destination', 'source environment files', 'build server'));
gulp.task('docker', gulp.series('source docker environment files', 'build server'))
