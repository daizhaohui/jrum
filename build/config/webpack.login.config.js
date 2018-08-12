const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AppConsts = require('../lib/appConsts');
const cwd = process.cwd();
const autoprefixerProcessor =  require('autoprefixer')({
    browsers:['last 5 versions']
});
const mergeConfig = require('webpack-merge');

function getFileLoaderOption(dirName) {
    var fileLoaderOption = {
            name: '[name].[ext]',
            outputPath: 'assets/'+dirName + '/'
        };
    return fileLoaderOption;
}


function getUrlLoadName(dirName) {
    return 'assets/'+dirName + '/[name].[ext]'
}

const devConfig = {
    devtool: '#inline-source-map'
};

module.exports = function(args,options) {

    var isProduction,
        cwd;

    isProduction  = args.env === AppConsts.ENV_PRODUCTION ? true : false;
    cwd = process.cwd();

    var config = {
        mode:args.env,
        entry: {
            'login':path.resolve(cwd, __dirname,'../template/js/login.js')
        },
        output: {
            path: path.resolve(cwd, args.output),
            filename:isProduction?'assets/js/[name].min.js':'assets/js/[name].js',
            chunkFilename:isProduction?'assets/js/[name].[chunkhash:6].min.js':'assets/js/[name].[chunkhash:6].js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /^node_modules$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['env','react','stage-0'],
                                plugins: ['syntax-dynamic-import','transform-class-properties',["import", {
                                    libraryName: "antd",
                                    style: "true"
                                }]],
                                compact: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    exclude: /^node_modules$/,
                    use: [
                        'style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                minimize: isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixerProcessor
                                ]
                            }
                        }
                    ]

                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader:"style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: {
                                minimize: isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixerProcessor
                                ]
                            }
                        },
                        {
                            loader: "less-loader"
                        }
                    ]
                },
                {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    exclude: /^node_modules$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: getUrlLoadName("images")
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    exclude: /^node_modules$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: getFileLoaderOption("fonts")
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename:"login.html",
                template:path.resolve(cwd,args.output,"login.html"),
                inject : 'body'
            }),
            new webpack.DefinePlugin( {'process.env.NODE.ENV':args.env}),
        ],
        performance: {
            hints: isProduction?"error":"warning",
            maxEntrypointSize: isProduction?600000:600000,
            maxAssetSize: isProduction?600000:600000,//单资源体积
        }
    };

    if(!isProduction){
       config =  mergeConfig(config,devConfig);
    }

    return config;
}