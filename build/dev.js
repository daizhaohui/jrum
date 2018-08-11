const parseArgv = require('./lib/parseArgs');
const createOptions = require('./lib/options');
const Builder = require('./lib/builder');
const devAppConfig = require('./config/webpack.dev.config');
const devLoginConfig = require('./config/webpack.login.config');
const AppConfigWatcher = require('./lib/appConfigWatcher');
const AppConfigReader = require('./lib/appConfigReader');
const AppConfigBuilder = require('./lib/builders/appConfigBuilder');
const Error = require('./lib/logger').error;
const args = parseArgv(process.argv);
const AppConsts = require('./lib/appConsts');

var options,
    configs,
    params;

args.env = AppConsts.ENV_DEVELOPMENT;
options = createOptions(args,'dev');
configs = [devLoginConfig(args,options),devAppConfig(args,options)];
params = {
    appConfigReader:  new AppConfigReader(args,options),
    appConfigBuilder: new AppConfigBuilder(args,options)
};

new Builder(args,configs,options).run(params,function (err) {
    if(err){
        Error(err);
    } else {
        //监控app.json变化
        new AppConfigWatcher(args,options).watch(params.appConfigReader,params.appConfigBuilder);
    }
    //清除目录
   // util.removeDirectory(path.resolve(process.cwd(),args.output,AppConsts.BUILD_TEMP_DIRECTORY))
});


