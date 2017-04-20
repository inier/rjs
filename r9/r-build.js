({
    appDir: "./",
    baseUrl: "./js",
    dir: "./r9-built",
    keepBuildDir: false,
    skipModuleInsertion: true,
    removeCombined: true,
    modules: [
        {
            name: 'main',
            include: ['a', 'b', 'c']
        }
    ],
    fileExclusionRegExp: /^(\.|build|demo|output)/,
    onBuildRead: function (moduleName, path, contents) {
        if (moduleName === 'main') {
            return '/* empty code */';
        }
        return contents;
    }
})