const path = require('path');
const fs = require('fs');
const AppConsts = require('./appConsts');

const Node_Names = [AppConsts.APP_CONFIG_NODE_NAMES.ROUTES,AppConsts.APP_CONFIG_NODE_NAMES.SERVICES,AppConsts.APP_CONFIG_NODE_NAMES.API_URLS,
    AppConsts.APP_CONFIG_NODE_NAMES.PLUGINS,AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO];

function AppConfigJSBuilder(args,options) {
    var i,
        item,
        len;

    this.args = args;
    this.options = options;

    this.importItems = {
        Header:["import React from 'react';","import Loadable from 'react-loadable';","import {LazyLoading} from 'jrum';"]
    };
    this.bodyItems = {};
    this.bodyContents = [];

    len = Node_Names.length;
    for(i=0;i<len;i++){
        item = Node_Names[i];
        if(item!==AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO){
            this.importItems[item] = [];
            this.bodyItems[item] = [];
        }
    }
    this.exportContent = `\nexport default {${Node_Names.join(',')}}`;
}


AppConfigJSBuilder.prototype.run = function() {
    var pName,
        item,
        output = [];

    for(pName in this.importItems) {
        this.importItems[pName].forEach(function(item){
            output.push(item);
        });
    }
    output.push(this.bodyContents.join("\n"));
    for(pName in this.bodyItems) {
        item = this.bodyItems[pName];
        if(item&&item.length>0){
            output.push(`\nconst ${pName}=[`);
            output.push(`${item.join(',\n')}`);
            output.push(`];`);
        } else {
            output.push(`\nconst ${pName}=[];`);
        }
    }
    output.push(this.exportContent);
    fs.writeFileSync(path.resolve(process.cwd(),this.args.target,'app.config.js'),output.join("\n"));
}

AppConfigJSBuilder.prototype.clearImportItems = function(name) {
    this.importItems[name].splice(0,this.importItems[name].length);
}

AppConfigJSBuilder.prototype.addImportItem = function(name,item) {
    this.importItems[name].push(item);
}

AppConfigJSBuilder.prototype.clearBodyItems = function(name) {
    this.bodyItems[name].splice(0,this.bodyItems[name].length);
}

AppConfigJSBuilder.prototype.addBodyItem = function(name,item) {
    this.bodyItems[name].push(item);
}

AppConfigJSBuilder.prototype.addContentToBody = function(content) {
    this.bodyContents.push(content);
}


AppConfigJSBuilder.prototype.clearItems = function(name) {
    this.clearImportItems(name);
    this.clearBodyItems(name);
}

AppConfigJSBuilder.prototype.createImportName = function(comp) {
    if(comp.isDefault) {
        return `${comp.import}`;
    } else {
        return `{${comp.import}}`;
    }
}

module.exports = AppConfigJSBuilder;