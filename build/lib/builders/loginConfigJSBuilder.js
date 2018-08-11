const path = require('path');
const fs = require('fs');
const AppConsts = require('../appConsts');

//const Node_Names = [AppConsts.APP_CONFIG_NODE_NAMES.API_URLS,AppConsts.APP_CONFIG_NODE_NAMES.APP_INFO];

function LoginConfigJSBuilder(args,options) {
    this.args = args;
    this.options = options;
    this.importItems = []
    this.bodyItems = [];
    this.exportItems = [];
}

LoginConfigJSBuilder.prototype.run = function() {
    var output = [];

    this.importItems.forEach(function (item) { output.push(item) });
    this.bodyItems.forEach(function (item) { output.push(item) });
    output.push(`\nexport default {${this.exportItems.join(',')}}`);
    fs.writeFileSync(path.resolve(__dirname,'../../temp/login.config.js'),output.join("\n"));
}

LoginConfigJSBuilder.prototype.addImportItem = function(item) {
    this.importItems.push(item);
}

LoginConfigJSBuilder.prototype.addExportItem = function(name) {
    this.exportItems.push(name);
}

LoginConfigJSBuilder.prototype.addBodyItem = function(item) {
    this.bodyItems.push(item);
}
module.exports = LoginConfigJSBuilder;