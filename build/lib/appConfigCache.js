const _AppConfigCache = {
    hashCode:{
        routes:'',
        api:'',
        services:'',
        plugins:'',
        info:''
    },
    routes:[], //{}
    api:{},//{prefixs:{},urls:[{},{}]}
    services:[],//{}
    plugins:[],//{}
    info:{},
    assets:{},
    //文件解析后的缓存
    parsedAppConfig:{
        apiConfigFiles:[],  //{file:'',items:[]}
        routeConfigFiles:[],//{file:'',items:[]}
        routes:[],
        apiUrls:[],
        services:[],
        plugins:[],
        info:{},
        assets:{}
    },
    //解析合并后的缓存：每次生成完app.config.js后就清空
    mergedAppConfig:{
        routes:[],
        apiUrls:[],
        services:[],
        plugins:[],
        info:{},
        assets:{}
    }
};

module.exports = _AppConfigCache;