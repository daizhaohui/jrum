const assign  = require('./util').assign;
const path = require('path');
const cwd = process.cwd();
const Error = require('./logger').error;
const AppConsts = require('./appConsts');
const _ImportNames_ = {};
var _AutoIncrement_ = 0;

function _createUniqueImportName(importName) {
    var index;

    index = importName.lastIndexOf('/');
    importName = index>=0?importName.slice(index+1):importName;

    if(_ImportNames_[importName]===1){
        return `${importName}_${++_AutoIncrement_}`;
    }
    _ImportNames_[importName] = 1;
    return importName;
}


function _parseComponent(val,prefix) {
    var comps,
        importName;
    comps = val.split(',')
    if(comps.length===1){
        importName = _createUniqueImportName(comps[0]);
        return {
            from:`${prefix}${comps[0]}`,
            import:importName,
            component:importName,
            isDefault:true //默认导出
        }
    } else if(comps.length===2){
        importName = _createUniqueImportName(comps[1]);
        return {
            from:`${prefix}${comps[0]}`,
            import:importName,
            component:importName,
            isDefault:false //导出名
        }
    }else{
        return null;
    }
}

function _parseRoutes(routes,obj) {
    var result,
        item;
    result = {
        routeConfigFiles:[],
        routes:[]
    };
    routes.forEach(function(route){
        if(typeof route === 'object') {
            item = _parseComponent(route.component,AppConsts.APP_COMPONENT_DIRECTORY);
            !item && Error(`${JSON.stringify(route)}:component  is invalid.`);
            item && result.routes.push(assign({},route,item));
        }
        else if(typeof route === 'string' && route.toLowerCase().indexOf('json')){
            result.routeConfigFiles.push({
                file:path.resolve(cwd,obj.args.target,AppConsts.ROUTE_COINFIG_DIREACTORY,route),
                items:[]
            });
        }
    });
    return result;
}

function _parseServices(services) {
    var result,
        item;
    result = {
        services:[]
    };
    services.forEach(function(service){
        if(typeof service === 'object') {
            item = _parseComponent(service.component,'');
            item ? result.services.push(assign({},service,item)) : Error(`${JSON.stringify(service)}:component is invalid.`);
        }
    });
    return result;
}

function _parseApi(api,obj) {
    var result,
        index,
        val,
        prefix;
    result = {
        apiConfigFiles:[],
        apiUrls:[]
    };
    api.urls.forEach(function(item){
        if(item.url && typeof item === 'object') {
            val = item.url.slice(0,item.url.indexOf('/'));
            index = val.indexOf('@');
            if(index>=0){
                prefix = api.prefixs[val.slice(index+1)];
                prefix ? result.apiUrls.push(assign({},item,{url:prefix+item.url.slice(item.url.indexOf('/'))})) : Error(`${JSON.stringify(item)}:@${prefix}} is undefined.`);
            } else {
                result.apiUrls.push(assign({},item));
            }
        }
        else if(typeof item === 'string' && item.toLowerCase().indexOf('json')>0){
            result.apiConfigFiles.push({
               file: path.resolve(cwd,obj.args.target,AppConsts.API_CONFIG_DIRECTORY,item),
                items:[]
            });
        }
    });
    return result;
}

function _parsePlugins(plugins) {

    var result,
        item;
    result = {
        plugins:[]
    };
    plugins.forEach(function(plugin){
        if(typeof plugin === 'object') {
            item = _parseComponent(plugin.component,'');
            item ? result.plugins.push(assign({},plugin,item)) : Error(`${JSON.stringify(plugin)}:component is invalid.`);
        }
    });
    return result;
}


function _parseInfo(info) {
    return {
        info:info
    }
}

function _parseAssets(assets) {
    return {
        assets:assets
    }
}

function AppConfigParser(args,config) {
    this.args = args;
    this.config = config;
}

AppConfigParser.prototype.parse = function() {
    var result = {};
    if(this.config.routes) {
        assign(result,_parseRoutes(this.config.routes,this));
    }
    if(this.config.getAllServices) {
        assign(result,_parseServices(this.config.getAllServices,this));
    }
    if(this.config.api) {
        assign(result,_parseApi(this.config.api,this));
    }
    if(this.config.plugins) {
        assign(result,_parsePlugins(this.config.plugins,this));
    }
    if(this.config.info) {
        assign(result,_parseInfo(this.config.info,this));
    }
    if(this.config.assets){
        assign(result,_parseAssets(this.config.assets,this));
    }

    return result;
}


module.exports = AppConfigParser;