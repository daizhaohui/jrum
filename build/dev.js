const parseArgv = require('./lib/parseArgs');
const createOptions = require('./lib/options');
const Builder = require('./lib/builder');
const devConfig = require('./config/webpack.dev.config');
const AppConfigWatcher = require('./lib/appConfigWatcher');
const AppConfigReader = require('./lib/appConfigReader');
const AppConfigBuilder = require('./lib/appConfigBuilder');
const Error = require('./lib/logger').error;
const args = parseArgv(process.argv);
const path = require('path');
const util = require('./lib/util');
const AppConsts = require('./lib/appConsts');

var options,
    config,
    params;


options = createOptions(args);
config = devConfig(args,options);
params = {
    appConfigReader:  new AppConfigReader(args,options),
    appConfigBuilder: new AppConfigBuilder(args,options)
};

new Builder(args,config,options).run(params,function (err) {
    if(err){
        Error(err);
    } else {
        //监控app.json变化
        new AppConfigWatcher(args,options).watch(params.appConfigReader,params.appConfigBuilder);
    }
    //清除目录
   // util.removeDirectory(path.resolve(process.cwd(),args.output,AppConsts.BUILD_TEMP_DIRECTORY))
});


