const  AppConsts  = require('../appConsts');
const LoginPluginBuilder = require('./loginHtmlBuilder');
const IndexPluginBuilder = require('../indexHtmlBuilder');
const CommonPluginBuilder = require('./commonPluginBuilder');

module.exports = {
    createBuilder:function(plugin,args,options){
        if(plugin.name === AppConsts.PLUGIN_NAMES.LOGIN) {
            return new LoginPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.INDEX) {
            return new IndexPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.HTTP) {
            return new CommonPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.ROUTE) {
            return new CommonPluginBuilder(plugin,args,options);
        }
        return null;
    }
}