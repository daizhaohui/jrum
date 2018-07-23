const AppConsts = require('../appConsts');
const uglifyjs = require('uglify-js');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const LoginJSBuilder = require('../loginJsBuilder');
const CssBuilder = require('../cssBuilder');

const TemplateContext = {
    css_login:'',
    js_jquery:'',
    js_login:'',
    title:'',
    getBackPassword:'',
    anonymous:false,
    copyright:''
};

function LoginHtmlBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

LoginHtmlBuilder.prototype.run = function (appConfigReader,next) {
    var appConfig,
        temp,
        template;

    appConfig = appConfigReader.getMergedAppConfig();
    temp = this.args.env===AppConsts.ENV_PRODUCTION ? 'min.' : '';

    TemplateContext.anonymous = appConfig.info.anonymous ? true : false;
    TemplateContext.title = appConfig.info.title;
    TemplateContext.copyright = appConfig.info.copyright;
    TemplateContext.getBackPassword = "__login__.getBackPassword()";
    TemplateContext.js_jquery =  `${AppConsts.APP_JS_DIRECTORY}/${AppConsts.FILE_NAME_JQUERY_JS}.min.js`;
    TemplateContext.css_login = `${AppConsts.APP_CSS_DIRECTORY}/${AppConsts.FILE_NAME_LOGIN_CSS}.${temp}css`;
    TemplateContext.js_login = `${AppConsts.APP_JS_DIRECTORY}/${AppConsts.FILE_NAME_LOGIN_JS}.${temp}js`;

    template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname,"../../template/html/login.html"),'utf8'));
    fs.writeFileSync(path.resolve(cwd,this.args.output,"login.html"),template(TemplateContext));

    //拷贝jquery文件
    fs.copyFileSync(path.resolve(__dirname,'../../template/js/jquery.min.js'),path.resolve(cwd,this.args.output,TemplateContext.js_jquery));

    new LoginJSBuilder(this.args,this.options).run(this.plugin.from); // this.plugin.from 源登录插件代码文件
    new CssBuilder(this.args,this.options).run(`${AppConsts.FILE_NAME_LOGIN_CSS}`,function(){
        next();
    });
}

module.exports = LoginHtmlBuilder;