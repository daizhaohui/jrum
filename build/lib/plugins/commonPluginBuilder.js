const AppConsts = require('../appConsts');
const path = require('path');

function CommonPluginBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

CommonPluginBuilder.prototype.run = function(appConfigReader,next) {
    var self;

    self = this;
    next(function(appConfigJSBuilder){
        var importName;
        importName = appConfigJSBuilder.createImportName(self.plugin);
        appConfigJSBuilder.addImportItem(AppConsts.APP_CONFIG_NODE_NAMES.PLUGINS,`import ${importName} from './${AppConsts.APP_PLUGINS_DIRECTORY}${self.plugin.from}';`);
        appConfigJSBuilder.addBodyItem(AppConsts.APP_CONFIG_NODE_NAMES.PLUGINS,`{name:'${self.plugin.name}',component:${importName}}`)
    });
}

module.exports = CommonPluginBuilder;