import Logger from '../utils/logger';
import ServiceManager from '../services/serviceManager';
import AuthService from '../services/authService';
import RouteService from '../services/routeService';
import HttpService from '../services/httpService';
import GlobalService from '../services/globalService';
import AppService from '../services/appService';
import ServiceNames from './serviceNames';

export default class SysServiceManager {

    static  register(appConfig,browserHistory,http,login,on) {
        var service;
    
        ServiceManager.registerService({
            name:ServiceNames.ROUTE,
            instance: new RouteService(appConfig.Routes,browserHistory)
        });
        service = new HttpService(appConfig.ApiUrls,http);
        //给登录接口设置统一的http属性值
        if(login){
            login.http = service;
        }
        ServiceManager.registerService({
            name:ServiceNames.HTTP,
            instance: service
        });
        ServiceManager.registerService({
            name:ServiceNames.GLOBAL,
            instance: new GlobalService(Logger)
        });

        ServiceManager.registerService({
            name:ServiceNames.APP,
            instance: new AppService(on)
        });

         if(login && login.getAuthorization) {
            login.getAuthorization(login.userName,(data)=>{
                ServiceManager.registerService({
                    name:ServiceNames.AUTH,
                    instance: new AuthService(data||[])
                });
            });
        } else {
            Logger.error('还没有实现登录插件获取权限方法：getAuthorization')
        }
    }

}