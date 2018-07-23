import Logger from '../utils/logger';
import ServiceManager from '../services/serviceManager';
import AuthService from '../services/authService';
import RouteService from '../services/routeService';
import HttpService from '../services/httpService';
import GlobalService from '../services/globalService';
import ServiceNames from './serviceNames';

export default class SysServiceManager {

    static  register(appConfig,browserHistory,http) {
        let _login = window.__login__;

        //注册系统提供的服务:权限和路由 http请求服务
        if(_login && _login.getAuthorization) {
            _login.getAuthorization((data)=>{
                ServiceManager.registerService({
                    name:ServiceNames.AUTH,
                    instance: new AuthService(data||[])
                });
            });
        } else {
            Logger.error('还没有实现登录插件获取权限方法：getAuthorization')
        }
        ServiceManager.registerService({
            name:ServiceNames.ROUTE,
            instance: new RouteService(appConfig.Routes,browserHistory)
        });
        ServiceManager.registerService({
            name:ServiceNames.HTTP,
            instance: new HttpService(appConfig.ApiUrls,http)
        });
        ServiceManager.registerService({
            name:ServiceNames.GLOBAL,
            instance: new GlobalService(Logger)
        });
    }

}