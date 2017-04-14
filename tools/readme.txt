r.js用法介绍

-o         表示优化，该参数是固定的，必选。

baseUrl    指存放模块的根目录，例如r4/js，因为cd到r4中了，只需设置为js。可选，如果没有设置将从r4中查找main.js。

name       模块的入口文件，这里设置成“main”，那么r.js会从baseUrl+main去查找。这里实际是r4/js/main.js。r.js会分析main.js，找出其所依赖的所有其它模块，然后合并压缩。

out        指合并压缩后输出的文件路径，这里直接是built.js，那么将输出到根目录下。

excludeShallow=selector 合并时排除selector模块

optimize (none/uglify/closure)   指定是否压缩，默认为uglify; none不开启压缩，仅合并


cssIn=css/main.css     指定cssIn的入口文件路径

out=css/built.css      指定合并后css的文件输出路径

* optimizeCss参数设置来配置是否压缩及压缩选项。
* optimizeCss的取值有standard/none/standard.keepLines/standard.keepComments/standard.keepComments.keepLines。

  none  不压缩，仅合并

  standard  标准压缩 去换行、空格、注释

  standard.keepLines  除标准压缩外，保留换行

  standard.keepComments  除标准压缩外，保留注释

  standard.keepComments.keepLines  除标准压缩外，保留换行和注释

