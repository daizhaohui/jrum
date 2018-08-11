const AppConsts = require('../appConsts');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

const TemplateContext = {
    font_files:[],
    js_files:[],
    css_files:[]
};

function _getRefFiles(args,dir,files) {
    var result,
        fileName,
        index,
        cache,
        refFile;
    result = [];
    cache = {};

    files.forEach(function (file) {
        fileName = path.resolve(cwd,args.output,dir,file);
        if(fs.existsSync(fileName)){
            refFile = `${dir}/${file}`;
            !cache[refFile] && result.push(refFile) && (cache[refFile]=true);
        }
        else{
            index = file.lastIndexOf('.');
            fileName = `${file.slice(0,index)}.min${file.slice(index)}`;
            if(fs.existsSync(path.resolve(cwd,args.output,dir,fileName))){
                refFile = `${dir}/${fileName}`;
                !cache[refFile] && result.push(refFile) && (cache[refFile]=true);
            }
        }
    });
    return result;
}

function IndexHtmlBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

IndexHtmlBuilder.prototype.run = function (appConfigReader,next) {
    var appConfig,
        temp,
        assets,
        template;

    appConfig = appConfigReader.getMergedAppConfig();
    assets = appConfig.assets;
    temp = this.args.env===AppConsts.ENV_PRODUCTION ? 'min.' : '';

    //处理文件引用
    assets.fonts && (TemplateContext.font_files=_getRefFiles(this.args,AppConsts.APP_FONT_DIRECTORY,assets.fonts));
    assets.css && (TemplateContext.css_files=_getRefFiles(this.args,AppConsts.APP_CSS_DIRECTORY,assets.css));
    assets.js && (TemplateContext.js_files=_getRefFiles(this.args,AppConsts.APP_JS_DIRECTORY,assets.js));

    template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname,"../../template/html/index.html"),'utf8'));
    fs.writeFileSync(path.resolve(cwd,this.args.output,"index.html"),template(TemplateContext));
    next();
}

module.exports = IndexHtmlBuilder;