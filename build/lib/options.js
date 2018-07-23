const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

module.exports = function createOptions(args){
    var options,
        file,
        config;

    options = {
        dev:{
            port:8080
        }
    };
    file = path.resolve(cwd,args.target,"dev.json");
    if(fs.existsSync(file)){
        config = JSON.parse(fs.readFileSync(file,'utf-8'));
        options.dev.port = config.port || options.dev.port;
        if(config.proxy) {
            options.dev.proxy = config.proxy;
        }
    }
    return options;
}
