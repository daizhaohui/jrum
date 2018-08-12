const mergeConfig = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');

module.exports = function(args,options) {
    var config;
    config = commonConfig(args,options);

    config = mergeConfig(config,{
        output: {
            filename:'assets/js/[name].min.js',
            chunkFilename:'assets/js/[name].[chunkhash:6].min.js'
        }
    });
    config.plugins.push(new UglifyJSPlugin());
    return config;
}