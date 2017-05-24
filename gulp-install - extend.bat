@echo off
echo -----  Gulp plugin Install START  -----
cnpm install --save-dev gulp-markdown markdown-pdf gulp-html2md
cnpm install bower -g
bower install require-css
cnpm install csso -g
echo ########  Gulp plugin Install END   ########
pause