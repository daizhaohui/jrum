import React from 'react';
import 'babel-polyfill';
import {
    Router,
    Route
} from 'react-router';
import createHistory from 'history/createHashHistory';
import {Provider} from 'react-redux'
import ServiceManager from '../services/serviceManager';
import ControllerManager from './controllerManager';
import MenuManager from '../jquery/menuManager';
import Logger from '../utils/logger';
import PluginManager from './pluginManager';
import SysServiceManager from './sysServiceManager';
import axios from 'axios';
import AppStore from './appStore';
import ServiceNames from './serviceNames';

const browserHistory = createHistory();
var _login;

if(typeof window.__login__ !== 'undefined'){
    _login = window.__login__;
    _login.userName = localStorage.getItem("__userName__");
} else {
    _login = undefined;
}

function _loadMenus(appConfig,self) {
    if(_login && _login.getMenus){
        _login.getMenus(_login.userName,(data)=>{
            //$.controlBoard().createLeftMenu(data).createTopMenu([]);
            //$.controlBoard.listen("routeChanged",self.routeChanage);
            MenuManager.createMenu(appConfig,data);
            $.controlBoard().leftMenuClicked(self.leftMenuClick);
            //$.controlBoard().topMenuClicked(self.topMenuClick);
        })
    } else {
        Logger.error('还没有实现登录插件获取菜单方法：getMenus')
    }
}

export  default  class AppEntry extends  React.Component {
    constructor(props) {
        super(props);
        this.leftMenuClick = this.leftMenuClick.bind(this);
        this.routeOnChanage = this.routeOnChanage.bind(this);
        this.currentRoute = {
          path:''
        };
    }

    componentWillMount(){
        let  {appConfig} = this.props;
        //初始化服务
        ServiceManager.init(appConfig);
         //加载插件
        PluginManager.loadPlugins(appConfig,axios);
        //注册系统默认提供的服务
        SysServiceManager.register(appConfig,browserHistory,axios,_login);
        //初始化控制器
        ControllerManager.initAllControllers();
        //创建菜单和路由信息
        _loadMenus(appConfig,this);

    }

    componentDidMount() {
        this.listenHistory = browserHistory.listen(this.routeOnChanage)
    }

    componentWillUnmount(){
        this.listenHistory && this.listenHistory();
    }

    leftMenuClick(sender,argObj) {
        var routeService;
        if(argObj.url && this.currentRoute.path !== argObj.url) {
            this.currentRoute.path = argObj.url;
            routeService = ServiceManager.getService(ServiceNames.ROUTE);
            routeService.push(argObj.url);
        }
    }

    routeOnChanage(location,action) {
        if(_login && !_login.anonymous && (!_login.userSessionIsValid() || !_login.userName)) {
            this.listenHistory && this.listenHistory();
            window.location.href = "login.html";
        }
    }


    render() {
        let  {appConfig} = this.props;
        return (
            <Provider store={AppStore}>
                <Router history={browserHistory}>
                    <div>
                        {
                            appConfig.Routes.map((item)=> {
                                return (
                                    <Route  exact path={item.path}  component={item.component} key={item.name}/>
                                )
                            })
                        }
                    </div>
                </Router>
            </Provider>
        );
    }
}

