const AppConsts = require('../appConsts');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

function DirectoryBuilder(args,options){
    this.args = args;
    this.options = options;
}

function _createDir(dir){
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

//创建需要的目录
DirectoryBuilder.prototype.run = function() {

    var dir,
        subDirs;


    subDirs = [AppConsts.BUILD_TEMP_DIRECTORY,AppConsts.APP_CSS_DIRECTORY,AppConsts.APP_JS_DIRECTORY,AppConsts.APP_FONT_DIRECTORY,AppConsts.APP_IMAGE_DIRECTORY];
    //根目录
    dir = path.resolve(cwd,this.args.output);
    _createDir(dir);

    _createDir(path.resolve(dir,`${AppConsts.APP_ASSERT_DIRECTORY}`));

    subDirs.forEach(function (subDir) {
        _createDir(path.resolve(dir,subDir));
    });

}

module.exports = DirectoryBuilder;