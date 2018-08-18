import Checker from '../utils/checker';
import StateHandler from './stateHandler';

/*
dipatch:config-redux dispatch
options:{
   controllerName
   prop
   func
}
 */
export default  function createAction(dispatch,controller,options) {
    var handler,args;
    /*
    参数检查
     */
    if(Checker.isFunction(options.func)===false){
        throw new Error(`uniqueName()=${options.controllerName} Controller: mapActionToProps().${options.prop} is not function`);
    }

    /*
    页面调用的函数
     */
    return function() {
        args = Array.prototype.slice.call(arguments);
        dispatch(
             (dispatch,getState)=>{
                handler =  StateHandler.createHandler(dispatch, getState(),controller);
                args.push(handler);
                options.func.apply(controller,args);
            }
        );
    }
}