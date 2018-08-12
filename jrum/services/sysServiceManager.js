import Logger from '../utils/logger';
import ServiceManager from './serviceManager';
import AuthService from './authService';
import RouteService from './routeService';
import HttpService from './httpService';
import GlobalService from './globalService';
import EventService from './eventService';
import ServiceNames from './serviceNames';
import CryptoService from './cryptoService';

export default class SysServiceManager {

    static  register(appConfig,browserHistory,http,data) {
    
        ServiceManager.registerService({
            name:ServiceNames.EVENT,
            instance: new EventService()
        });

        ServiceManager.registerService({
            name:ServiceNames.CRYPTO,
            instance: new CryptoService()
        });
    
        ServiceManager.registerService({
            name:ServiceNames.ROUTE,
            instance: new RouteService(appConfig.Routes,browserHistory)
        });
    
        ServiceManager.registerService({
            name:ServiceNames.HTTP,
            instance:  new HttpService(appConfig.ApiUrls,http)
        });
        ServiceManager.registerService({
            name:ServiceNames.GLOBAL,
            instance: new GlobalService(Logger)
        });

        ServiceManager.registerService({
            name:ServiceNames.AUTH,
            instance: new AuthService(data.authority||[])
        });
        
    }

}