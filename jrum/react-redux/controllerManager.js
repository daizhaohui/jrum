import Checker from '../utils/checker';
import Controller from './controller';
import ServiceManager from '../services/serviceManager';

const _controllerCache = {

};
let _isInitialized = false;


export default  class ControllerManager{

    static getControllerInstance(name) {
        if(!name || !_controllerCache[name]) {
            throw new Error(`Controller [${name}] is not exist`);
        }
        return _controllerCache[name];
    }

    static getAllControllers() {
        var controllers = [];
        for(var name in _controllerCache) {
            controllers.push(_controllerCache[name]);
        }
        return controllers;
    }

    static  addControllerInstance(name,instance) {
        if(Checker.isController(instance)===false){
            throw new Error(`Instance type is not Controller`);
        }
        _controllerCache[name] = instance;
        instance.init();
    }

    static initAllControllers() {
        if(!_isInitialized) {
            Object.defineProperty(Controller.prototype,"services",{
                configurable:false,
                enumerable:true,
                writable:false,
                value:ServiceManager.getAllServices()
            });

            for(var name in _controllerCache) {
                _controllerCache[name].init();
            }
            _isInitialized = true;
        }
    }

}