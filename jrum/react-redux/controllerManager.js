import Checker from '../utils/checker';
import Controller from './controller';
import ServiceManager from '../services/serviceManager';

// const _controllerCache = {

// };
let _isInitialized = false;

export default  class ControllerManager{

    static initAllControllers() {
        if(!_isInitialized) {
            Object.defineProperty(Controller.prototype,"Services",{
                configurable:false,
                enumerable:true,
                writable:false,
                value:ServiceManager.getAllServices()
            });
            _isInitialized = true;
        }
    }

}