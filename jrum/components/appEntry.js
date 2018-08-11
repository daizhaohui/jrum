import React from 'react';
import 'babel-polyfill';
import {
    Router,
    Route
} from 'react-router';
import createHistory from 'history/createHashHistory';
import {Provider} from 'react-redux'
import ServiceManager from '../services/serviceManager';
import ControllerManager from '../react-redux/controllerManager';
import PluginManager from '../plugins/pluginManager';
import SysServiceManager from '../services/sysServiceManager';
import axios from 'axios';
import ServiceNames from '../services/serviceNames';
import AppStore from '../react-redux/appStore';


const browserHistory = createHistory();

export  default  class AppEntry extends  React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let  {appConfig} = this.props;
        this.data = JSON.parse(window.localStorage.getItem("__data__"));
        window.localStorage.removeItem("__data__");
        //初始化服务
        ServiceManager.init(appConfig);
         //加载插件
        PluginManager.loadPlugins(appConfig,axios);
        //注册系统默认提供的服务
        SysServiceManager.register(appConfig,browserHistory,axios,this.data);
        //初始化控制器
        ControllerManager.initAllControllers();
        //创建菜单和路由信息
        _loadMenus(appConfig,this);

    }

    componentDidMount() {
       
    }

    componentWillUnmount(){
       
    }

    changeRoute = (name,paras)=>{
        var routeService = ServiceManager.getService(ServiceNames.ROUTE);
        if(paras){
            routeService.push(name,paras);
        } else {
            routeService.push(name);
        }     
    }

    render() {
        let  {appConfig} = this.props;
        var MainLayout = appConfig.MainLayout;
        var routeComponents =  appConfig.Routes.map((item)=> {
            return (
                <Route  exact path={item.path}  component={item.component} key={item.name}/>
            )
        });
        return (
            <Provider store={AppStore}>
                <Router history={browserHistory}>
                    <MainLayout Services={ServiceManager.getAllServices()} AppInfo={appConfig.AppInfo} Menus={this.data.menus} ChangeRoute={this.changeRoute} RouteComponents={routeComponents} />                    
                </Router>
            </Provider>
        );
    }
}

