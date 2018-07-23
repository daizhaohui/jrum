const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const AppConfigCache = require('./appConfigCache');
const util = require('./util');
const crypto = require('crypto');
const AppConfigParser = require('./appConfigParser');
const AppConsts = require('./appConsts');
const Warning = require('./logger').warn;
const Error = require('./logger').error;

function _crateHashCode(content){
    return crypto.createHash('md5').update(content).digest('hex');
}

function _findIndexOfItem(items,val){
    var i,
        len;
    len = items.length;
    for(i=0;i<len;i++){
        if(items[i]["name"]===val){
            return i;
        }
    }
}

function _mergeItems(mergedItems,items){
    var i,
        len,
        item,
        index;
    len = items.length;
    for(i=0;i<len;i++){
        item = items[i];
        index = _findIndexOfItem(mergedItems,item['name']);
        if(index>=0){
           // util.assign(mergedItems[index],item);
            Warning(`${JSON.stringify(item)}:name [${item.name}] has been defined in multi places.The name is expected to be unique`);
        } else {
            mergedItems.push(item);
        }
    }
}


function _readFromAppJsonFile(command) {
    if(command.target && command.target==="routes"){
        util.assign(AppConfigCache.parsedAppConfig,new AppConfigParser(this.args,{routes:AppConfigCache.routes}).parse());
        _mergeParsedConfigRouteData();
    }
    else if(command.target && command.target==="api"){
        util.assign(AppConfigCache.parsedAppConfig,new AppConfigParser(this.args,{api:AppConfigCache.api}).parse());
        _mergeParsedConfigApiData();
    }
    else if(command.target && command.target==="getAllServices"){
        util.assign(AppConfigCache.parsedAppConfig,new AppConfigParser(this.args, {services:AppConfigCache.services}).parse());
        _mergeParsedConfigServiceData();
    }
}

function _readFromOuterFiles(command,obj) {
    if(command.target && command.target==="routes"){
        command.addFiles &&  _parseRouteFiles(command.addFiles,obj);
        command.updatedFiles &&  _parseRouteFiles(command.updatedFiles,obj);
        _mergeParsedConfigRouteData();
    }
    else if(command.target && command.target==="api"){
        command.addFiles &&  _parseApiFiles(command.addFiles,obj);
        command.updatedFiles &&  _parseApiFiles(command.updatedFiles,obj);
        _mergeParsedConfigApiData();
    }
    else if(command.target && command.target==="getAllServices"){
        _mergeParsedConfigServiceData();
    }
}

function _readItemsFromFile(file){
    if(!fs.existsSync(file)){
        Error(`reading file [${file}] is failed: the file is not exist.`);
        return null;
    }
    return util.fromJsonFileToObject(file);
}

function _mergeParsedConfigRouteData() {
    AppConfigCache.mergedAppConfig.routes.splice(0,AppConfigCache.mergedAppConfig.routes.length);
    _mergeItems(AppConfigCache.mergedAppConfig.routes,AppConfigCache.parsedAppConfig.routes);
    AppConfigCache.parsedAppConfig.routeConfigFiles.forEach(function(item){
        _mergeItems(AppConfigCache.mergedAppConfig.routes,item.items);
    });
}

function _mergeParsedConfigApiData() {
    AppConfigCache.mergedAppConfig.apiUrls.splice(0,AppConfigCache.mergedAppConfig.apiUrls.length);
    _mergeItems(AppConfigCache.mergedAppConfig.apiUrls,AppConfigCache.parsedAppConfig.apiUrls);
    AppConfigCache.parsedAppConfig.apiConfigFiles.forEach(function(item){
        _mergeItems(AppConfigCache.mergedAppConfig.apiUrls,item.items);
    });
}
function _mergeParsedConfigServiceData() {
    AppConfigCache.mergedAppConfig.services.splice(0,AppConfigCache.mergedAppConfig.services.length);
    AppConfigCache.parsedAppConfig.services.forEach(function (item) {
        AppConfigCache.mergedAppConfig.services.push(item);
    });
}

function _mergeParsedConfigData() {
    _mergeParsedConfigServiceData();
    _mergeParsedConfigRouteData();
    _mergeParsedConfigApiData();
    AppConfigCache.mergedAppConfig.plugins = AppConfigCache.parsedAppConfig.plugins;
    AppConfigCache.mergedAppConfig.info = AppConfigCache.parsedAppConfig.info;
    AppConfigCache.mergedAppConfig.assets = AppConfigCache.parsedAppConfig.assets;
}

function _findConfigFile(files,file){
    var i,
        len,
        item;
    len = files.length;
    for(i=0;i<len;i++){
        item = files[i];
        if(item.file === file) {
            return item;
        }
    }
    return null;
}

function _parseRouteFiles(files,obj){
    var i,
        len,
        item,
        items;

    len = files.length;    //AppConfigCache.parsedAppConfig.routeConfigFiles.length;
    for(i=0;i<len;i++){
        item = _findConfigFile(AppConfigCache.parsedAppConfig.routeConfigFiles,files[i]);
        if(item){
            items = _readItemsFromFile(files[i]);
            items && (item.items = (new AppConfigParser(obj.args,{routes:items}).parse()).routes);
        }
    }
}

function _parseApiFiles(files,obj){
    var i,
        len,
        item,
        items;

    len = files.length;
    for(i=0;i<len;i++){
        item = _findConfigFile(AppConfigCache.parsedAppConfig.apiConfigFiles,files[i]);
        if(item){
            items = _readItemsFromFile(files[i]);
            items && (item.items = (new AppConfigParser(obj.args,{api:{prefixs:AppConfigCache.api.prefixs,urls:items}}).parse()).apiUrls);
        }
    }
}

function AppConfigReader(args,options){
    this.args = args;
    this.options = options;
    this.readCount = 0; //0:标识第一次读取文件
}

AppConfigReader.prototype.read = function (command) {
    //部分读去部分更新，routes,api,services进行缓存，其它app.json信息更改需要重启方可以更新
    if(command) {
        command.outerFileIsChanged  ?  _readFromOuterFiles(command,this) :_readFromAppJsonFile(command,this);
    }
    //全新读取全量更新
    else {
        //解析app.json文件
        this.readAppJson();
        //解析route外部文件
        _parseRouteFiles(AppConfigCache.parsedAppConfig.routeConfigFiles.map(function(item){return item.file}),this);
        //解析api外部文件
        _parseApiFiles(AppConfigCache.parsedAppConfig.apiConfigFiles.map(function(item){return item.file}),this);
        //合并解析后的appConfig数据
        _mergeParsedConfigData();
    }
};

function _mergeParsedAppConfig(appConfig,newAppConfig){
    var itemCache;
    newAppConfig.routeConfigFiles.forEach(function(item){
        itemCache = _findConfigFile(appConfig.routeConfigFiles,item.file);
        itemCache && (item.items = itemCache.items);
    });
    newAppConfig.apiConfigFiles.forEach(function(item){
        itemCache = _findConfigFile(appConfig.apiConfigFiles,item.file);
        itemCache && (item.items = itemCache.items);
    });
    util.assign(appConfig,newAppConfig)
}

AppConfigReader.prototype.readAppJson = function() {
    var content,
        jsonObj,
        fileName,
        returnValue;

    returnValue = {
        preHashCode:null,
        curHashCode:{},
        preRouteFiles:null,
        curRouteFiles:null,
        preApiFiles:null,
        curApiFiles:null
    };
    returnValue.preHashCode = util.assign({},AppConfigCache.hashCode);
    returnValue.preRouteFiles=AppConfigCache.parsedAppConfig.routeConfigFiles.map(function(item){return item.file});
    returnValue.preApiFiles=AppConfigCache.parsedAppConfig.apiConfigFiles.map(function(item){return item.file});
    fileName = path.resolve(cwd,this.args.target,AppConsts.APP_CONFIG_FILE_NAME);
    if(!fs.existsSync(fileName)) {
        throw new Error(`File ${fileName} is not exist！`)
    }
    jsonObj = util.fromJsonFileToObject(fileName);
    if(!jsonObj){
        return null;
    }

    content = JSON.stringify(jsonObj.routes);
    returnValue.curHashCode.routes = _crateHashCode(content);

    content = JSON.stringify(jsonObj.services);
    returnValue.curHashCode.services = _crateHashCode(content);

    content = JSON.stringify(jsonObj.api);
    returnValue.curHashCode.api = _crateHashCode(content);

    content = JSON.stringify(jsonObj.plugins);
    returnValue.curHashCode.plugins = _crateHashCode(content);

    content = JSON.stringify(jsonObj.info);
    returnValue.curHashCode.info = _crateHashCode(content);

    AppConfigCache.routes = jsonObj.routes;
    AppConfigCache.services = jsonObj.services;
    AppConfigCache.api = jsonObj.api;
    AppConfigCache.plugins = jsonObj.plugins;
    AppConfigCache.info = jsonObj.info;
    AppConfigCache.assets = jsonObj.assets;


    _mergeParsedAppConfig(AppConfigCache.parsedAppConfig,new AppConfigParser(this.args,{
        routes:AppConfigCache.routes,
        services:AppConfigCache.services,
        plugins:AppConfigCache.plugins,
        api:AppConfigCache.api,
        info:AppConfigCache.info,
        assets:AppConfigCache.assets
    }).parse());

    returnValue.curRouteFiles = AppConfigCache.parsedAppConfig.routeConfigFiles.map(function(item){return item.file});
    returnValue.curApiFiles = AppConfigCache.parsedAppConfig.apiConfigFiles.map(function(item){return item.file});

    //第一次读
    if(this.readCount<=0){
        util.assign(returnValue.preHashCode,returnValue.curHashCode);
        returnValue.preRouteFiles=returnValue.curApiFiles;
        returnValue.preApiFiles=returnValue.curApiFiles;
        this.readCount += 1;
    }

    //更新hashcode
    util.assign(AppConfigCache.hashCode,returnValue.curHashCode);
    return returnValue;
};

AppConfigReader.prototype.getParsedAppConfig = function() {
    return AppConfigCache.parsedAppConfig;
};

AppConfigReader.prototype.getMergedAppConfig = function() {
    return AppConfigCache.mergedAppConfig;
};


module.exports = AppConfigReader;