const merge = require('webpack-merge');

var  multi_configs = [];

module.exports = {
    add:function(config) {
        multi_configs.push(config);
    },
    allConfig:function(){
      return multi_configs;
    }
}