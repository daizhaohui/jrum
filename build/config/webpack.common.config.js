const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AppConsts = require('../lib/appConsts');
const cwd = process.cwd();
const autoprefixerProcessor =  require('autoprefixer')({
    browsers:['last 5 versions']
});

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


module.exports = function(args,options) {

    var isProduction,
        cwd;

    isProduction  = args.env === AppConsts.ENV_PRODUCTION ? true : false;
    cwd = process.cwd();

    const config = {
        mode:args.env,
        entry: {
            'app':path.resolve(cwd, __dirname,'../template/js/app.js'),
            'jrum':['jrum'],
            'vendor':['react','react-dom','react-router','react-redux','prop-types','react-loadable','babel-polyfill']
        },
        output: {
            path: path.resolve(cwd, args.output),
            filename:'assets/js/[name].js',
            chunkFilename:'assets/js/[name].[chunkhash:6].js'
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
                                    "libraryDirectory": "es",
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
                filename:"index.html",
                template:path.resolve(cwd,args.output,"index.html"),
                inject : 'body'
            }),
            new webpack.DefinePlugin( {'process.env.NODE.ENV':args.env}),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HashedModuleIdsPlugin(),

        ],
        optimization:{
            runtimeChunk: {
                name: "manifest"
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all",
                        enforce: true,
                        reuseExistingChunk: true
                    },
                    jrum: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "jrum",
                        chunks: "all",
                        enforce: true,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        performance: {
            hints: isProduction?"error":"warning",
            maxEntrypointSize: isProduction?10000000:60000000,
            maxAssetSize: isProduction?10000000:6000000,//单资源体积
        }
    };

    return config;
}