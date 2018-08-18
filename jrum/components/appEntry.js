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
import CryptoService from '../services/cryptoService';
import ModelManager from '../model/modelManager';


const browserHistory = createHistory();

export  default  class AppEntry extends  React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let  {appConfig} = this.props;
        var cryptoService = new CryptoService();
        //初始化菜单和权限数据
        try{
            this.data = window.localStorage.getItem("__data__");
            //不存在，重新登录
            if(!this.data){
                window.location.href="login.html";
            }
            this.data = cryptoService.AES.decrypt(this.data,"jrumdata");
            this.data = JSON.parse(this.data);
        }catch(e){
            console.error(e);
        }
        //初始化服务
        ServiceManager.init(appConfig);
        //加载插件
        PluginManager.loadPlugins(appConfig,axios);
        //注册系统默认提供的服务
        SysServiceManager.register(appConfig,browserHistory,axios,this.data);
         //初始化模型数据
         ModelManager.initAllModelDefautValue();
        //初始化控制器
        ControllerManager.initAllControllers();
       
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

