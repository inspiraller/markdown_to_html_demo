# How to add stylelint plugins?

# prerequisites
node, npm, 

gulp or (sublime, sublime linter, sublime contrib stylelint)

---
## Seeing stylelint errors in IDE - Sublime

### cd to your project
$ cd c:\project\myproject


### get this project
$ git clone this into your project

### Add package.json file if you haven't already done so
$ npm init

### install stylelint if you haven't already done so
$ npm install stylelint --save-dev

### add .stylelintrc
This is an example that uses one of the custom classes.

.stylelintrc
```javascript
{
	"plugins": [		
		"./custom_lint_rules/no-extending-classes/index.js"		
	],
	"rules": {
		"custom_lint_rules/no-extending-classes":true
	}
}
```
### Add your project to the sublime folder tree
c:\project\myproject

Edit a .scss file
Notice annotations appear on the left if you type in something that is bad code.

---

## Seeing stylelint errors in gulp
(follow steps above first)

### install npm dependencies:
$ npm install stylelint gulp-stylelint stringify stringify-object gulp --save-dev

# create gulpfile
gulpfile.js:
```
var gulp          = require('gulp');
var gulpStyleLint = require('gulp-stylelint');

gulp.task('stylelint',function(){
  return gulp
    .src('*.scss')
    .pipe(
      gulpStyleLint({
        reporters: [
          {formatter: 'string', console: true}
        ]
      })
    );
})
```

# run gulp stylelint
$ gulp stylelint

You should see errors appear in your console log for bad code.