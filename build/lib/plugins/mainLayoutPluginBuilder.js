const AppConsts = require('../appConsts');
const path = require('path');

function MainLayoutPluginBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

MainLayoutPluginBuilder.prototype.run = function(appConfigReader,next) {
    var self;
    self = this;
    next(function(context){
        var importName;
        importName = self.plugin.import;
        context.appConfigJSBuilder.addImportItem(AppConsts.APP_CONFIG_NODE_NAMES.PLUGINS,`import ${importName} from '../../../${self.args.target}/${AppConsts.APP_PLUGINS_DIRECTORY}${self.plugin.from}';`);
        context.appConfigJSBuilder.addExportItem(`MainLayout:${importName}`);
    });
}

module.exports = MainLayoutPluginBuilder;