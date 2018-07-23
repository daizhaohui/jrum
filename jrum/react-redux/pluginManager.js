import Checker from '../utils/checker';
import ServiceManager from '../services/serviceManager';

function _loadHttpPlugin(plugin,http) {

    var instance = _createInstance(plugin);

    if(Checker.isFunction(instance.setHttpDefaultSetting)) {
        instance.setHttpDefaultSetting(http);
    }

    if(Checker.isFunction(instance.requestInterceptor)){
        http.interceptors.request.use(instance.requestInterceptor);
    }

    if(Checker.isFunction(instance.responseInterceptor)){
        http.interceptors.response.use(instance.responseInterceptor);
    }
}

function _createInstance(plugin){
    var instance = new plugin.component();

    Object.defineProperty(instance,"services",{
        configurable:false,
        writable:false,
        enumerable:true,
        value:ServiceManager.getAllServices()
    });
    return instance;
}


export  default  class PluginManager {


    static loadPlugins(appConfig,http){
        var i,
            plugin,
            len;

        len = appConfig.Plugins ? appConfig.Plugins.length:0;
        for(i=0;i<len;i++){
            plugin = appConfig.Plugins[i];
            //http插件处理
            if(plugin.name === "http") {
                _loadHttpPlugin(plugin,http)
            }
        }
    }

}