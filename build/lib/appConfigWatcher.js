const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const Error = require('./logger').error;
const AppConsts = require('./appConsts');

function AppConfigWatcher(args,options){
    this.args = args;
    this.options = options;
}

function _getChangedFileCmd(oldFiles,newFiles){
    var oldFilesString,
        newFilesString,
        returnValue,
        delFiles,
        addFiles;
    oldFilesString = oldFiles.join(',')+',';
    newFilesString = newFiles.join(',')+',';
    delFiles = [];
    addFiles = [];
    returnValue = {
        outerFileIsChanged:false
    };
    newFiles.forEach(function(file){
       if(oldFilesString.indexOf(file+',')<0){
           addFiles.push(file);
       }
    });
    oldFiles.forEach(function(file){
        if(newFilesString.indexOf(file+',')<0){
            delFiles.push(file);
        }
    });
    if(delFiles.length>0){
        returnValue.deletedFiles=delFiles;
        returnValue.outerFileIsChanged = true;
    }
    if(addFiles.length>0){
        returnValue.addFiles=addFiles;
        returnValue.outerFileIsChanged = true;
    }
    return returnValue;
}




AppConfigWatcher.prototype.watch = function(appConfigReader,appConfigBuilder) {

    var command,
        changeInfo,
         appConfig,
        file,
        i,
        len,
        _this = this;
    /*
    命令
    {
        deletedFiles:[],
        addFiles:[],
        updatedFiles:[],
        outerFileIsChanged:false //外部配置文件是否发生变化,
        target:'' //变化目标  routes,api,getAllServices
    }
     */
    //监控app.json
    fs.watch(path.resolve(cwd,this.args.target,AppConsts.APP_CONFIG_FILE_NAME),function(){
        try{
            //重新读取app.json
            changeInfo = appConfigReader.readAppJson();
            if(!changeInfo){
                return;
            }
            if(changeInfo.preHashCode.routes !== changeInfo.curHashCode.routes) {
                command = _getChangedFileCmd(changeInfo.preRouteFiles,changeInfo.curRouteFiles);
                command.target = "routes";
                appConfigReader.read(command);
                appConfigBuilder.buildRoutes(appConfigReader);
            }
            if(changeInfo.preHashCode.api !== changeInfo.curHashCode.api){
                command = _getChangedFileCmd(changeInfo.preApiFiles,changeInfo.curApiFiles);
                command.target = "api";
                appConfigReader.read(command);
                appConfigBuilder.buildApi(appConfigReader);
            }
            if(changeInfo.preHashCode.getAllServices !== changeInfo.curHashCode.getAllServices){
                command = {
                    target: "getAllServices",
                    outerFileIsChanged:false
                }
                appConfigReader.read(command);
                appConfigBuilder.buildServices(appConfigReader);
            }
        } catch(err){
            Error(err);
        }

    });

    //监控config/route
    fs.watch(path.resolve(cwd,this.args.target,AppConsts.ROUTE_COINFIG_DIREACTORY),function(eventType,filename){
        try{
            appConfig = appConfigReader.getParsedAppConfig();
            file = path.resolve(cwd,_this.args.target,AppConsts.ROUTE_COINFIG_DIREACTORY,filename);
            len = appConfig.routeConfigFiles.length;
            for(i=0;i<len;i++){
                //判断变化的配置文件是否在app.json配置中
                if(appConfig.routeConfigFiles[i].file.indexOf(file)>=0){
                    command = {
                        target: "routes",
                        outerFileIsChanged:true,
                        updatedFiles:[file]
                    };
                    appConfigReader.read(command);
                    appConfigBuilder.buildRoutes(appConfigReader);
                    break;
                }
            }
        } catch(err){
            Error(err);
        }_this

    });
    //监控config/api
    fs.watch(path.resolve(cwd,this.args.target,AppConsts.API_CONFIG_DIRECTORY),function(eventType,filename){
        try{
            appConfig = appConfigReader.getParsedAppConfig();
            file = path.resolve(cwd,_this.args.target,AppConsts.API_CONFIG_DIRECTORY,filename);
            len = appConfig.apiConfigFiles.length;
            for(i=0;i<len;i++){
                //判断变化的配置文件是否在app.json配置中
                if(appConfig.apiConfigFiles[i].file.indexOf(file)>=0){
                    command = {
                        target: "api",
                        outerFileIsChanged:true,
                        updatedFiles:[file]
                    };
                    appConfigReader.read(command);
                    appConfigBuilder.buildApi(appConfigReader);
                    break;
                }
            }
        }catch(err){
            Error(err);
        }

    });




};

module.exports = AppConfigWatcher;