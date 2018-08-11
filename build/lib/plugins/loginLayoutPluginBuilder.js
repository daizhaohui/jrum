const AppConsts = require('../appConsts');
const path = require('path');

function MainLayoutPluginBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

MainLayoutPluginBuilder.prototype.run = function(appConfigReader,next) {
    var self,
        appConfig,
        path;

    self = this;
    appConfig = appConfigReader.getMergedAppConfig();
    path = `${this.args.target}/${AppConsts.APP_PLUGINS_DIRECTORY}`;

    next(function(context){
        var importName,
            jsBuilder = context.loginConfigJSBuilder;

        importName = self.plugin.import;
        jsBuilder.addImportItem(`import ${importName} from '../../../${path}${self.plugin.from}';`);
        jsBuilder.addExportItem(`LoginLayout:${importName}`);

        jsBuilder.addBodyItem(`var ${AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO}=${JSON.stringify(appConfig.info)};`);
        jsBuilder.addBodyItem(`var ${AppConsts.APP_CONFIG_NODE_NAMES.API_URLS}=${JSON.stringify(appConfig.apiUrls)};`);
        jsBuilder.addExportItem(AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO);
        jsBuilder.addExportItem(AppConsts.APP_CONFIG_NODE_NAMES.API_URLS);
    });
}

module.exports = MainLayoutPluginBuilder;