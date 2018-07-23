import {INIT_DATA} from './actionTypes';
import {connect} from 'react-redux'
import StateInitializer from './stateInitializer';
import ControllerManager from './controllerManager';
import ControllerParser from './controllerParser';
import ServiceManager from '../services/serviceManager';
import AppStore from './appStore';
import ServiceNames from './serviceNames';

export default function connectController(controllerClass,view){
    var mapActionToProps,
        mapStateToProps,
        controllerParser,
        controller;

    controller = new controllerClass();
    controllerParser = new ControllerParser(controller);
    controllerParser.check();

    mapActionToProps = (dispatch)=>{
        return controllerParser.getMapActionToProps(dispatch);
    };

    mapStateToProps = (state) => {
        return controllerParser.getMapStateToProps(state);
    };

    //服务注入到view
    if(view.prototype.hasOwnProperty("Services")===false){
        Object.defineProperty(view.prototype,"Services",{
            value:ServiceManager.getAllServices(),
            writable:false,
            configurable:false,
            enumerable:true
        });
    }

    /*初始化默认值*/
    controller.init = ()=>{
        if(!controller.initialized){
            AppStore.dispatch(
                {
                    type:INIT_DATA,
                    payLoad:new StateInitializer(controllerParser.controllerName,controllerParser.stateDefines).getValue(),
                }
            );
            Object.defineProperty(controller,"initialized",{
                value:true,
                writable:false,
                configurable:false,
                enumerable:true
            })
        }
    }
    controller.init.bind(controller);

    ControllerManager.addControllerInstance(controllerParser.controllerName,controller);
    return connect(mapStateToProps,mapActionToProps)(view);

}