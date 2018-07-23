const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const AppConsts = require('./appConsts');
const Waring = require('./logger').warn;
const Error = require('./logger').error;
const util = require('./util');

function CopyAssets(args,options){
    this.args = args;
    this.options = options;
}

function _copyFileTo(args,options,dirName,file) {
    var fileName = path.resolve(cwd,args.target,dirName,file);
    if(fs.existsSync(fileName)){
        _createDirectory(args,options,dirName,file);
        if(file.indexOf('.')<=0){
            return;
        }
        fs.copyFileSync(fileName,path.resolve(cwd,args.output,dirName,file));
    } else {
        Error(`${fileName} is not exist.`)
    }

}

function _createDirectory(args,options,dirName,file){
    var index =  file.lastIndexOf('/');
    if(file.indexOf('.')<=0){
        return;
    }
    if(index>0){
        util.createDirectory(path.resolve(cwd,args.output,dirName),file.slice(0,index));
    }
}


function _copyFonts(fonts,args,options) {
    fonts.forEach(function (font) {
        _copyFileTo(args,options,AppConsts.APP_FONT_DIRECTORY,font);
    });
}

function _copyImages(images,args,options) {
    images.forEach(function (image) {
        if(image.path){
            _copyFileTo(args,options,AppConsts.APP_IMAGE_DIRECTORY,image.path);
        } else {
            Error(`${JSON.stringify(image)}:invalid path.`);
        }
    });
}

function _copyJS(jsFiles,args,options) {
    var dir = path.resolve(cwd,args.target,AppConsts.APP_JS_DIRECTORY),
        data,
        fileName;

    jsFiles.forEach(function (jsFile) {
        fileName = path.resolve(dir,jsFile);
        if(fs.existsSync(fileName)){
            data = fs.readFileSync(fileName,'utf-8');
            if(args.env===AppConsts.ENV_PRODUCTION && jsFile.indexOf('.min.js')<0 && data.length>200){
                _createDirectory(args,options,AppConsts.APP_JS_DIRECTORY,jsFile);
                fs.writeFileSync(path.resolve(cwd,args.output,AppConsts.APP_JS_DIRECTORY,jsFile.slice(0,jsFile.lastIndexOf('.'))+'.min.js'),util.minifyJS(data))
            } else {
                _copyFileTo(args,options,AppConsts.APP_JS_DIRECTORY,jsFile);
            }
        } else {
            Waring(`JS File [${fileName}] is not exist.`);
        }

    });
}

function _copyCss(css,args,options) {
    var dir = path.resolve(cwd,args.target,AppConsts.APP_CSS_DIRECTORY),
        data,
        fileName;

    css.forEach(function (cssFile) {
        fileName = path.resolve(dir,cssFile);
        if(fs.existsSync(fileName)){
            if(args.env===AppConsts.ENV_PRODUCTION && cssFile.indexOf('.min.css')<0){
                data = fs.readFileSync(fileName,'utf-8');
                util.minifyCss(data,function (result) {
                    _createDirectory(args,options,AppConsts.APP_CSS_DIRECTORY,cssFile);
                    fs.writeFileSync(path.resolve(cwd,args.output,AppConsts.APP_CSS_DIRECTORY,cssFile.slice(0,cssFile.lastIndexOf('.'))+'.min.css'),result);
                });
            } else {
                _copyFileTo(args,options,AppConsts.APP_CSS_DIRECTORY,cssFile);
            }
        } else {
            Waring(`Css File [${fileName}] is not exist.`);
        }

    });
}


CopyAssets.prototype.run = function(appConfigReader) {

    var assets = appConfigReader.getMergedAppConfig().assets;

    assets.fonts &&  _copyFonts(assets.fonts,this.args,this.options);
    assets.images && _copyImages(assets.images,this.args,this.options);
    assets.js && _copyJS(assets.js,this.args,this.options);
    assets.css && _copyCss(assets.css,this.args,this.options);

};




module.exports = CopyAssets;