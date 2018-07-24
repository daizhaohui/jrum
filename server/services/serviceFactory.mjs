import ServicesConfig from './servicesConfig.mjs';

export default class ServiceFactory{

    static getService(name){
        return new ServicesConfig[name]();
    }
}