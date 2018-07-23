const merge = require('webpack-merge');
const path = require('path');
const AppConsts = require('./appConsts');
const cwd = process.cwd();
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const CommonConfig = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /^node_modules$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'stage-0'],
                        }
                    }
                ]
            }
        ]
    },
    plugins:[]
}


function WebpackConfigCreator(args,options){
    this.args = args;
    this.options = options;
}

WebpackConfigCreator.prototype.create = function(sourceFile) {
    var file = sourceFile.slice(sourceFile.lastIndexOf('/')+1);
    this.args.env === AppConsts.ENV_PRODUCTION && CommonConfig.plugins.push(new UglifyJSPlugin());
    return merge(CommonConfig,{
        mode:this.args.env,
        entry: {
            [`${file.slice(0,file.indexOf('.'))}`]: `${sourceFile}`,
        },
        output: {
            path: path.resolve(cwd,this.args.output,AppConsts.APP_JS_DIRECTORY),
            filename:  this.args.env === AppConsts.ENV_PRODUCTION ? '[name].min.js':'[name].js',
        },
    });

}

module.exports = WebpackConfigCreator;