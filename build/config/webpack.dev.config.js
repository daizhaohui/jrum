const commonConfig = require('./webpack.common.config');
const mergeConfig = require('webpack-merge');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = function(args,options) {
    var config = commonConfig(args,options);
    config = mergeConfig(config, {
        devtool: '#inline-source-map'
    });
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new OpenBrowserPlugin(
        {
            url: `http://localhost:${options.dev.port}/login.html`
        }
    ));
    return config;
}