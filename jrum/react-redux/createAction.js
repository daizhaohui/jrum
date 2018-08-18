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
    /*
    页面调用的函数
     */
    return function() {
        var args = Array.prototype.slice.call(arguments);
        dispatch(
             (dispatch,getState)=>{
                options.func.apply(controller,args);
            }
        );
    }
}