import {INIT_DATA} from './actionTypes';
import {connect} from 'react-redux'
import StateInitializer from './stateInitializer';
import ControllerManager from './controllerManager';
import ControllerParser from './controllerParser';
import ServiceManager from '../services/serviceManager';
import AppStore from './appStore';

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
    return connect(mapStateToProps,mapActionToProps)(view);

}