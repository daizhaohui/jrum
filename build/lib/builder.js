const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const util = require('./util');
const DirectoryBuilder = require('./directoryBuilder');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const AppConsts = require('./appConsts');
const Error = require('./logger').error;
const Info = require('./logger').info;
const MultiConfig = require('./multiWebpackConfig');
const CopyAssets = require('./copyAssets');

function Builder(args,config,options){
    this.args = args;
    this.config = config;
    this.options = options;
}
/*
params:{appConfigReader,appConfigBuilder}
 */
Builder.prototype.run = function (params,callback) {
    var config,
        self;

    self = this;
    //清空目录
    util.clearDirecoty(path.resolve(cwd,this.args.output));
    //创建目录，生成框架的代码
    new DirectoryBuilder(this.args,this.options).run();
    //读取文件
    params.appConfigReader.read();
    //拷贝assets资源
    new CopyAssets(this.args,this.options).run(params.appConfigReader);
    //开始生产appConfig.js
    params.appConfigBuilder.run(params.appConfigReader,next);

    function next() {
        var options;

        if(AppConsts.DEBUG){
            return  callback(null);
        }


        options = {
            contentBase: path.resolve(cwd,self.args.output),
            hot: true,
            historyApiFallback: false,
            compress: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            open : false,
            inline:true,
            stats: { colors: true }
        };
        if(self.options.dev.proxy){
            options.proxy = self.options.dev.proxy;
        }
        //构建打包代码
        MultiConfig.add(self.config);
        config = MultiConfig.allConfig();
        //构建应用逻辑代码
        if(self.args.env===AppConsts.ENV_DEVELOPMENT) {
            new WebpackDevServer(webpack(config),options).listen(self.options.dev.port, "localhost", function() {
            });
            callback && callback(null);
        } else {
            webpack(config,function(err, stats){
                //处理webpack本身的error
                if (err) {
                    Error(err.stack || err);
                    throw new Error(err);
                }
                console.log(stats.toString({
                    chunks: true,
                    colors: true
                }));
                callback && callback(null);
            });
        }
    }



};

module.exports = Builder;