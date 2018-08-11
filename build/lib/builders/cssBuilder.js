const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const AppConsts = require('../appConsts');
const util = require('../util');
const Error = require('../logger').error;

function CssBuilder(args,options){
    this.args = args;
    this.options = options;
}

CssBuilder.prototype.run = function(templateFileName,next) {
    var _this,
        sourceFile,
        targetFile;

    _this = this;
    sourceFile = path.resolve(__dirname,`../template/css/${templateFileName}.css`);
    targetFile = this.args.env === AppConsts.ENV_PRODUCTION ? 'min.' : '';
    targetFile = path.resolve(cwd,_this.args.output,`${AppConsts.APP_CSS_DIRECTORY}/${templateFileName}.${targetFile}css`)

    if(this.args.env === AppConsts.ENV_PRODUCTION) {
        util.minifyCss(fs.readFileSync(sourceFile,'utf-8'),function (data){
            if(data){
                fs.writeFileSync(targetFile,data,'utf-8');
            }
            next && next();
        });
    }else{
        fs.copyFileSync(sourceFile,targetFile);
        next && next();
    }
}

module.exports = CssBuilder;