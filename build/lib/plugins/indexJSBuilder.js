const fs = require('fs');
const path = require('path');
const AppConsts = require('../appConsts');
const Handlebars = require('handlebars');
const util = require('../util');

const TemplateContext = {
    anonymous:'false'
};

function IndexJSBuilder(args,options) {
    this.args = args;
    this.options = options;
}

IndexJSBuilder.prototype.run = function(appConfigReader,next) {

    var template,
        code,
        appConfig;

    appConfig = appConfigReader.getMergedAppConfig();
    TemplateContext.anonymous = appConfig.info.anonymous ? 'true' : 'false';
    template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname,'../../template/js/index.js'),'utf-8'));
    code = template(TemplateContext);
    if(this.args.env===AppConsts.ENV_PRODUCTION && code.length>200) {
        code = util.minifyJS(code);
    }
    return code;
}

module.exports = IndexJSBuilder;