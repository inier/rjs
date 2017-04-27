/**
 * Created by mosa on 2016/6/12.
 */
var gulp = require('gulp');
var markdownpdf = require("markdown-pdf");

// development or production
var config = require('../../../conf')('production').assets.markdown.toPdf;
/**
 * Markdown2Pdf
 */
//gulp.task('Md2Pdf-fs', function () {
//    var fs = require("fs");
//    fs.createReadStream(config.src)
//        .pipe(markdownpdf())
//        .pipe(fs.createWriteStream(config.dist + "/document.pdf"));
//});

// --- OR ---
gulp.task('Md2Pdf-single', function () {
    var mdDocs = config.src;
    //var mdDocs = ["chapter1.md", "chapter2.md", "chapter3.md"];
    var docPath = config.dist + "/" + "readme.pdf";

    markdownpdf().concat.from(mdDocs).to(docPath, function () {
        console.log("Created", docPath);
    })
});
// --- OR ---
gulp.task('Md2Pdf-Multi', function () {
    var mdDocs = config.src;
    //var mdDocs = ["home.md", "about.md", "contact.md"];
    var filename, path;
    var pdfDocs = mdDocs.map(function (d) {
        path = d;
        //��·���н�ȡ�ļ���[������׺��]
        if (path.indexOf("/") > 0) {
            //����������"/"�� ������һ��"/"��+1��λ�ÿ�ʼ��ȡ�ַ���
            filename = path.substring(path.lastIndexOf("/") + 1, path.length);
        }
        else {
            filename = path;
        }
        return config.dist + "/" + filename.replace(".md", ".pdf");
    });

    markdownpdf().from(mdDocs).to(pdfDocs, function () {

        pdfDocs.forEach(function (d) {
            console.log("Created", d);
        })
    });
});