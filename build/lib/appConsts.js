module.exports = {
    ROUTE_COINFIG_DIREACTORY:'config/route', //路由配置文件路径
    API_CONFIG_DIRECTORY:'config/api',//Api配置文件路径
    APP_CONFIG_FILE_NAME:'app.json', //应用全局配置文件名
    APP_COMPONENT_DIRECTORY:"components/", //组件所在目录
    APP_PLUGINS_DIRECTORY:'plugins/', //插件所在目录
    BUILD_TEMP_DIRECTORY:'temp', //构建时候临时的目录

    ENV_DEVELOPMENT:'development', //开发模式
    ENV_PRODUCTION:'production', //产品模式

    APP_ASSERT_DIRECTORY:'assets',//应用非html文件根目录
    APP_JS_DIRECTORY:'assets/js',//应用js代码文件所在目录
    APP_CSS_DIRECTORY:'assets/css',//应用样式文件所在目录
    APP_IMAGE_DIRECTORY:'assets/images',//应用图片文件所在目录
    APP_FONT_DIRECTORY:'assets/fonts',//应用字体文件所在目录

    FILE_NAME_LOGIN_JS:'login', //登录脚本文件名,
    FILE_NAME_LOGIN_CSS:'login',//登录样式文件名,
    FILE_NAME_JQUERY_JS:'jquery',//jquery 文件名
    FILE_NAME_AXIOS_JS:'axios',//axios 文件名
    FILE_NAME_CONTROL_BOARD_CSS:'control-board',//首页样式文件名
    FILE_NAME_CONTROL_BOARD_JS:'controlboard',//首页脚本文件名


    APP_CONFIG_NODE_NAMES:{
        PLUGINS : 'Plugins',
        SERVICES : 'Services',
        ROUTES : 'Routes',
        API_URLS : 'ApiUrls',
        APP_INFO: 'AppInfo'
    },

    PLUGIN_NAMES:{
        LOGIN:"login",
        INDEX:'index',
        HTTP:'http',
        ROUTE:'route'
    },


    DEBUG:false

}