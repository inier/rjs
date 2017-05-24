/**
 * 全局变量设置
 */

// == 基本属性
module.exports = {
    project: {
        name: 'CAEC-web', // 项目名称
        version: 'v1.7', // 发布版本号
        dir: {
            root: '.', // 根目录
            src: 'web6', // 源文件
            beta: 'beta', // 测试版本输出
            prod: 'prod', // 发布版本输出
            asset: 'rock', // 资源
            vendor: 'com', // 第三方库
            common: 'js', // 公共组件库
            mock: '_mock', // MOCK
            view: 'views', // VIEW
            tpl: 'templates', // 模板                    
            doc: 'doc', // 文档
            style: 'css', // 样式
            script: 'js', // 脚本
            image: 'img', // 图片
            font: 'fonts' // 字体
        }
    },
    sprite: {
        dir: '_sprites', // 精灵图sprite合并
        outFile: '_sprite',
        spriteRange: ["body-cacf", "body-diy", "body-diys"] // 这里添加需要打包精灵图的目录
    }
}
