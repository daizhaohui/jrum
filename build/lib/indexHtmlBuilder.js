const AppConsts = require('./appConsts');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const IndexJSBuilder = require('./plugins/indexJSBuilder');
const util = require('./util');

const TemplateContext = {
    css_control_board:'',
    js_jquery:'',
    js_login:'',
    title:'',
    js_control_board:'',
    js_index_entry:'',
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

    TemplateContext.anonymous = appConfig.info.anonymous ? true : false;
    TemplateContext.title = appConfig.info.title;
    TemplateContext.js_jquery =  `${AppConsts.APP_JS_DIRECTORY}/${AppConsts.FILE_NAME_JQUERY_JS}.min.js`;
    TemplateContext.css_control_board = `${AppConsts.APP_CSS_DIRECTORY}/${AppConsts.FILE_NAME_CONTROL_BOARD_CSS}.${temp}css`;
    TemplateContext.js_login = `${AppConsts.APP_JS_DIRECTORY}/${AppConsts.FILE_NAME_LOGIN_JS}.${temp}js`;
    TemplateContext.js_control_board = `${AppConsts.APP_JS_DIRECTORY}/${AppConsts.FILE_NAME_CONTROL_BOARD_JS}.${temp}js`;
    TemplateContext.js_index_entry = new IndexJSBuilder(this.args,this.options).run(appConfigReader);

    //处理文件引用
    assets.fonts && (TemplateContext.font_files=_getRefFiles(this.args,AppConsts.APP_FONT_DIRECTORY,assets.fonts));
    assets.css && (TemplateContext.css_files=_getRefFiles(this.args,AppConsts.APP_CSS_DIRECTORY,assets.css));
    assets.js && (TemplateContext.js_files=_getRefFiles(this.args,AppConsts.APP_JS_DIRECTORY,assets.js));


    template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname,"../template/html/index.html"),'utf8'));
    fs.writeFileSync(path.resolve(cwd,this.args.output,"index.html"),template(TemplateContext));

    //拷贝文件
    fs.copyFileSync(path.resolve(__dirname,'../template/js/jquery.min.js'),path.resolve(cwd,this.args.output,TemplateContext.js_jquery));
    fs.copyFileSync(path.resolve(__dirname,'../template/js/controlboard.js'),path.resolve(cwd,this.args.output,TemplateContext.js_control_board));
    fs.copyFileSync(path.resolve(__dirname,'../template/css/control-board.css'),path.resolve(cwd,this.args.output,TemplateContext.css_control_board));

    //压缩css，js
    if(this.args.env===AppConsts.ENV_PRODUCTION) {
        temp = path.resolve(cwd,this.args.output,TemplateContext.js_control_board);
        fs.writeFileSync(temp,util.minifyJS(fs.readFileSync(temp,'utf-8')));
        temp = path.resolve(cwd,this.args.output,TemplateContext.css_control_board);
        util.minifyCss(fs.readFileSync(temp,'utf-8'),function(data){
            data && fs.writeFileSync(temp,data);
        });
    }
    next();
}

module.exports = IndexHtmlBuilder;