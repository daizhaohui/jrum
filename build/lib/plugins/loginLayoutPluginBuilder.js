const AppConsts = require('../appConsts');
const util = require('../util');
const _ = require("lodash");

function MainLayoutPluginBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

MainLayoutPluginBuilder.prototype.run = function(appConfigReader,next) {
    var self,
        appConfig,
        path,
        httpPlugin;

    self = this;
    appConfig = appConfigReader.getMergedAppConfig();
    path = `${this.args.target}/${AppConsts.APP_PLUGINS_DIRECTORY}`;
    httpPlugin = _.find(appConfig.plugins,function(item){return item.name===AppConsts.PLUGIN_NAMES.HTTP});

    next(function(context){
        var importName,
            jsBuilder = context.loginConfigJSBuilder;

        importName = util.getImportName(self.plugin);
        jsBuilder.addImportItem(`import ${importName} from '../../../${path}${self.plugin.from}';`);
        jsBuilder.addExportItem(`LoginLayout:${importName}`);

        if(httpPlugin){
            importName = util.getImportName(httpPlugin);
            jsBuilder.addImportItem(`import ${importName} from '../../../${path}${httpPlugin.from}';`);
            jsBuilder.addExportItem(`HttpPlugin:${importName}`);
        }

        jsBuilder.addBodyItem(`var ${AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO}=${JSON.stringify(appConfig.info)};`);
        jsBuilder.addBodyItem(`var ${AppConsts.APP_CONFIG_NODE_NAMES.API_URLS}=${JSON.stringify(appConfig.apiUrls)};`);
        jsBuilder.addExportItem(AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO);
        jsBuilder.addExportItem(AppConsts.APP_CONFIG_NODE_NAMES.API_URLS);
        
    });
}

module.exports = MainLayoutPluginBuilder;