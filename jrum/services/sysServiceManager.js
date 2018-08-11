import Logger from '../utils/logger';
import ServiceManager from './serviceManager';
import AuthService from './authService';
import RouteService from './routeService';
import HttpService from './httpService';
import GlobalService from './globalService';
import AppService from './appService';
import EventService from './eventService';
import ServiceNames from './serviceNames';

export default class SysServiceManager {

    static  register(appConfig,browserHistory,http,data) {
        var service;

        ServiceManager.registerService({
            name:ServiceNames.EVENT,
            instance: new EventService()
        });
    
        ServiceManager.registerService({
            name:ServiceNames.ROUTE,
            instance: new RouteService(appConfig.Routes,browserHistory)
        });
        service = new HttpService(appConfig.ApiUrls,http);

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

        ServiceManager.registerService({
            name:ServiceNames.AUTH,
            instance: new AuthService(data.authority||[])
        });
        
    }

}