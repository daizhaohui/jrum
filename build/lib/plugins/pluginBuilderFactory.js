const  AppConsts  = require('../appConsts');
const LoginLayoutPluginBuilder = require('./loginLayoutPluginBuilder');
const IndexPluginBuilder = require('./indexHtmlBuilder');
const LoginPluginBuilder = require('./loginHtmlBuilder')
const CommonPluginBuilder = require('./commonPluginBuilder');
const MainLayoutPluginBuilder = require('./mainLayoutPluginBuilder');

module.exports = {
    createBuilder:function(plugin,args,options){
        if(plugin.name === AppConsts.PLUGIN_NAMES.LOGIN_LAYOUT) {
            return new LoginLayoutPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.INDEX) {
            return new IndexPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.LOGIN) {
            return new LoginPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.HTTP) {
            return new CommonPluginBuilder(plugin,args,options);
        }
        else if(plugin.name === AppConsts.PLUGIN_NAMES.ROUTE) {
            return new CommonPluginBuilder(plugin,args,options);
        } else if(plugin.name === AppConsts.PLUGIN_NAMES.MAIN_LAYOUT){
            return new MainLayoutPluginBuilder(plugin,args,options);
        }
        return null;
    }
}