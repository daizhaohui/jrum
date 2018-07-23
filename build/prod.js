const parseArgv = require('./lib/parseArgs');
const createOptions = require('./lib/options');
const Builder = require('./lib/builder');
const args = parseArgv(process.argv);
const AppConfigReader = require('./lib/appConfigReader');
const AppConfigBuilder = require('./lib/appConfigBuilder');
const prodConfig = require('./config/webpack.prod.config');
const Error = require('./lib/logger').error;
const Info = require('./lib/logger').info;
const path = require('path');
const util = require('./lib/util');
const AppConsts = require('./lib/appConsts');

var config,
    options,
    params;

args.env = AppConsts.ENV_PRODUCTION;

options = createOptions(args);
config = prodConfig(args,options);
params = {
    appConfigReader:  new AppConfigReader(args,options),
    appConfigBuilder: new AppConfigBuilder(args,options)
};

new Builder(args,config,options).run(params,function(err){
    if(err){
        Error(err);
    }
    //清除目录
    util.removeDirectory(path.resolve(process.cwd(),args.output,AppConsts.BUILD_TEMP_DIRECTORY))
    Info("Build End.")
});