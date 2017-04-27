/**
 * Created by mosa on 2016/3/11.
 */
var requireDir = require('require-dir');
// Require all tasks in gulp/tasks, including subfolders
requireDir('./config/gulp/tasks', {recurse: true});