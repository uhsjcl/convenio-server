import gulp from 'gulp';
import babel from 'gulp-babel';
import typescript from 'gulp-typescript';
import merge from 'merge2';

const src = './src/**/*.ts';
const out = './build';
const babelConf = { presets: ['preset-env'] };                // use preset-env
const project = typescript.createProject('tsconfig.json', {   // match tsconfig
  outDir: out,
  typescript: require('typescript')
});

gulp.task('build', () => {                              // build ts with definitions
  var result = gulp.src(src).pipe(typescript(project));

  return merge([
    result.dts.pipe(gulp.dest(`${out}/definitions`)),
    result.js
      .pipe(babel(babelConf))
      .pipe(gulp.dest(`${out}/js`))
  ]);
});

gulp.task('watch', ['build'], () => {                   // watch for changes
  gulp.watch(src, ['build']);
});

gulp.task('configure', () => {                          // transfer dotenv variables to prod
  return gulp.src('.env')
    .pipe(gulp.dest('build/dist'));
});

gulp.task('default', ['build']);
gulp.task('deploy', ['build', 'configure'])