const PluginBuilderFactory = require('./pluginBuilderFactory');
const AppConsts = require('../appConsts');
const util = require('../util');


function PluginManager(appConfigReader,args,options) {
    this.args = args;
    this.options = options;
    this.appConfigReader = appConfigReader;
}

function _indexOfPlugin(plugins,name){
    var i,
        len;
    len = plugins.length;

    for(i=0;i<len;i++){
        if(plugins[i].name===name){
            return i;
        }
    }
    return -1;
}

PluginManager.prototype.getAllPlugins = function() {
    var appConfig,
        sortedPlugins,
        index;

    appConfig = this.appConfigReader.getMergedAppConfig();
    sortedPlugins = [{
        name: AppConsts.PLUGIN_NAMES.LOGIN,
        component:''
    },{
        name: AppConsts.PLUGIN_NAMES.INDEX,
        component:''
    }];


    appConfig.plugins.forEach((plugin)=>{
        index = _indexOfPlugin(sortedPlugins,plugin.name);
        if(index>=0) {
            util.assign(sortedPlugins[index],plugin);
        } else {
            sortedPlugins.push(plugin);
        }
    });

    if(!appConfig.info.anonymous && !sortedPlugins[0].component) {
        throw new Error(`app.json中登录插件[lgoin]还没有配置`);
    }
    return sortedPlugins;

}

PluginManager.prototype.createPluginBuilder = function(plugin) {
    var appConfig = this.appConfigReader.getMergedAppConfig();
    return  PluginBuilderFactory.createBuilder(plugin,this.args,util.assign(this.options,{
        plugins:appConfig.plugins,
        apiUrls:appConfig.apiUrls,
        info:appConfig.info,
        routes:appConfig.routes
    }));
};


module.exports = PluginManager;