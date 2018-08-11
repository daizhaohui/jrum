const fs = require('fs');
const path = require('path');

function LoginHtmlBuilder(plugin,args,options) {
    this.args = args;
    this.options = options;
    this.plugin = plugin;
}

LoginHtmlBuilder.prototype.run = function (appConfigReader,next) {
    var appConfig,
        data;

    appConfig = appConfigReader.getMergedAppConfig();
    data = fs.readFileSync(path.resolve(__dirname,"../../template/html/login.html"),'utf8');
    fs.writeFileSync(path.resolve(process.cwd(),this.args.output,"login.html"),data);
    next();
}

module.exports = LoginHtmlBuilder;