import ServicesConfig from './servicesConfig.mjs';

export default class ServiceFactory{

    getService(name){
        return new ServicesConfig[name]();
    }
}