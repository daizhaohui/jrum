const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const AppConsts = require('./appConsts');
const Handlebars = require('handlebars');
const util = require('./util');
const webpack = require('webpack');
const Error = require('./logger').error;
const WebConfigCreator = require('./webpackConfigCreator');
const MultiConfig = require('./multiWebpackConfig');

const TemplateContext = {
    login_plugin_component:''
};

function LoginJSBuilder(args,options) {
    this.args = args;
    this.options = options;
}

LoginJSBuilder.prototype.run = function(pluginFile) {

    var template,
        targetFile,
        sourceFile,
        config,
        httpPlugin;

    if(!pluginFile){
        Error('login plugin is empty.')
        return;
    }

    httpPlugin = this.options.plugins.find(item=>item.name===AppConsts.PLUGIN_NAMES.HTTP);

    //根据模板文件，生成login.js文件,然后把login.js文件转换成es2015代码
    //生成引用插件类的代码
    TemplateContext.login_plugin_component = path.resolve(cwd,this.args.target,AppConsts.APP_PLUGINS_DIRECTORY,pluginFile);
    TemplateContext.http_plugin_component = path.resolve(cwd,this.args.target,AppConsts.APP_PLUGINS_DIRECTORY,httpPlugin.component);
    TemplateContext.http_service_component = path.resolve(__dirname,"../template/js/httpService.js");
    TemplateContext.apiUrls = JSON.stringify(this.options.apiUrls);
   
    template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname,'../template/js/login.js'),'utf-8'));
    targetFile = path.resolve(cwd,this.args.output,AppConsts.APP_JS_DIRECTORY,`${AppConsts.FILE_NAME_LOGIN_JS}`);
    targetFile = this.args.env===AppConsts.ENV_PRODUCTION ? `${targetFile}.min.js` : `${targetFile}.js`;
    sourceFile = path.resolve(cwd,this.args.output,AppConsts.BUILD_TEMP_DIRECTORY,`${AppConsts.FILE_NAME_LOGIN_JS}`);
    sourceFile = this.args.env===AppConsts.ENV_PRODUCTION ? `${sourceFile}.min.js`:`${sourceFile}.js`;
    config = new WebConfigCreator(this.args,this.options).create(sourceFile);
    fs.writeFileSync(sourceFile,template(TemplateContext));
    MultiConfig.add(config);
}

module.exports = LoginJSBuilder;