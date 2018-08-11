const path = require('path');
const fs = require('fs');
const AppConsts = require('../appConsts');
const PluginManager = require('../plugins/pluginManager');
const AppConfigJSBuilder = require('./appConfigJSBuilder');
const LogConfigJSBuilder = require('./loginConfigJSBuilder');

function _buildRoutes(self,appConfigReader) {
    var appConfig,
        item,
        importName,
        i,
        len,
        from;

    appConfig = appConfigReader.getMergedAppConfig();
    self.appConfigJSBuilder.clearItems(AppConsts.APP_CONFIG_NODE_NAMES.ROUTES);
    len = appConfig.routes.length;
    for(i=0;i<len;i++){
        item = appConfig.routes[i];
        importName = self.appConfigJSBuilder.createImportName(item);
        from = `../../../${self.args.target}/${item.from}`;
        //异步加载组件
        if(item.thunkName){
            self.appConfigJSBuilder.addBodyItem(AppConsts.APP_CONFIG_NODE_NAMES.ROUTES,`{name:'${item.name}',path:'${item.path}',component:Loadable({loader: () => import(/* webpackChunkName: "${item.thunkName}" */ "${from}"), loading:LazyLoading})}`);
        }
        //同步加载组件
        else {
            self.appConfigJSBuilder.addImportItem(AppConsts.APP_CONFIG_NODE_NAMES.ROUTES,`import ${importName} from '${from}';`);
            self.appConfigJSBuilder.addBodyItem(AppConsts.APP_CONFIG_NODE_NAMES.ROUTES,`{name:'${item.name}',path:'${item.path}',component:${item.component}}`)
        }
    }
}

function _buildInfo(self,appConfigReader) {
    var appConfig,
         content;
    appConfig = appConfigReader.getMergedAppConfig();
    content = `var ${AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO} = ${JSON.stringify(appConfig.info)};`;
    self.appConfigJSBuilder.addContentToBody(content);
}

function _buildServices(self,appConfigReader) {
    var appConfig,
        item,
        importName,
        i,
        len,
        from;

    appConfig = appConfigReader.getMergedAppConfig();
    self.appConfigJSBuilder.clearItems(AppConsts.APP_CONFIG_NODE_NAMES.SERVICES);
    len = appConfig.services.length;
    for(i=0;i<len;i++) {
        item = appConfig.services[i];
        importName = self.appConfigJSBuilder.createImportName(item);
        from = `../../../${self.args.target}/${item.from}`;
        self.appConfigJSBuilder.addImportItem(AppConsts.APP_CONFIG_NODE_NAMES.SERVICES,`import ${importName} from '${from}';`);
        self.appConfigJSBuilder.addBodyItem(AppConsts.APP_CONFIG_NODE_NAMES.SERVICES,`{name:'${item.name}',component:${item.component}}`)
    }

}

function _buildPlugins(self,appConfigReader,callback) {
    var plugins,
        len,
        pluginBuilder,
        pManager

    pManager = new PluginManager(appConfigReader,self.args,self.options);
    plugins = pManager.getAllPlugins();
    len = plugins.length;
    self.appConfigJSBuilder.clearItems(AppConsts.APP_CONFIG_NODE_NAMES.PLUGINS);
    function iterate(index) {
        if(index===len) {
           return callback && callback();
        }
        pluginBuilder = pManager.createPluginBuilder(plugins[index]);
        pluginBuilder ? pluginBuilder.run(appConfigReader,function(callback){
             callback && callback({
                 appConfigJSBuilder:self.appConfigJSBuilder,
                 loginConfigJSBuilder:self.loginConfigJSBuilder
             });
            iterate(index+1);
        }) : iterate(index+1);
    }
    iterate(0);
}

function _buildApi(self,appConfigReader) {
    var appConfig,
        item,
        i,
        len;
    appConfig = appConfigReader.getMergedAppConfig();
    len = appConfig.apiUrls.length;
    self.appConfigJSBuilder.clearBodyItems(AppConsts.APP_CONFIG_NODE_NAMES.API_URLS);
    for(i=0;i<len;i++) {
        item = appConfig.apiUrls[i];
        self.appConfigJSBuilder.addBodyItem(AppConsts.APP_CONFIG_NODE_NAMES.API_URLS,`{name:'${item.name}',url:'${item.url}'}`)
    }
}



function AppConfigBuilder(args,options){
    this.args = args;
    this.options = options;
    this.appConfigJSBuilder = new AppConfigJSBuilder(args,options);
    this.loginConfigJSBuilder = new LogConfigJSBuilder(args,options);
}

AppConfigBuilder.prototype.run = function(appConfigReader,next) {
    var self = this;

    _buildRoutes(self, appConfigReader);
    _buildApi(self, appConfigReader);
    _buildInfo(self, appConfigReader);
    _buildServices(self, appConfigReader);
    _buildPlugins(self, appConfigReader, function () {
        self.loginConfigJSBuilder.run();
        self.appConfigJSBuilder.run();
        next && next();
    });
}

AppConfigBuilder.prototype.buildRoutes = function(appConfigReader) {
    _buildRoutes(this,appConfigReader);
    this.appConfigJSBuilder.run();

};

AppConfigBuilder.prototype.buildInfo = function(appConfigReader) {
    _buildInfo(this,appConfigReader);
    this.appConfigJSBuilder.run();
};


AppConfigBuilder.prototype.buildServices = function(appConfigReader) {
    _buildServices(this,appConfigReader);
    this.appConfigJSBuilder.run();
};

AppConfigBuilder.prototype.buildPlugins = function(appConfigReader) {
    _buildPlugins(this,appConfigReader);
    this.appConfigJSBuilder.run();
};

AppConfigBuilder.prototype.buildApi = function(appConfigReader) {
    _buildApi(this,appConfigReader);
    this.appConfigJSBuilder.run();
};

module.exports = AppConfigBuilder;
