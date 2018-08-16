import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA} from './actionTypes';
import Checker from '../utils/checker';


function _throwNameIsNotExist(name,controllerName) {
    throw new Error(`uniqueName()=${controllerName} Controller: state name is ${name} that is not exist.`);
}

function _getPayLoad(indexOrKeyOrFunc) {
    if(Checker.isNumber(indexOrKeyOrFunc)){
        return {
            index:parseInt(indexOrKeyOrFunc)
        }
    }
    else if(Checker.isString(indexOrKeyOrFunc)){
        return {
            key:indexOrKeyOrFunc
        }
    }
    else if(Checker.isFunction(indexOrKeyOrFunc)){
        return {
            func:indexOrKeyOrFunc
        }
    }
    return {
    }

}

export  default  class  StateHandler {

    constructor(dispatch,state,controller){
        this.dispatch = dispatch;
        this.state = state;
        this.controllerName = controller.uniqueName();
        this.stateDefines = controller.state();
    }

    /*
    给集合对象中添加数据，
     */
    append(name,appendedItem){
       if(this.stateDefines[name]){
            this.dispatch({
                type:APPEND_DATA,
                name:name,
                controllerName:this.controllerName,
                stateDefine:this.stateDefines[name],
                payLoad:appendedItem
            })
            return this;
       } else {
           _throwNameIsNotExist(name,this.controllerName);
       }
   }

   delete(name,indexOrKeyOrFunc) {
       var payLoad;
       if(this.stateDefines[name]){
           payLoad = _getPayLoad(indexOrKeyOrFunc);
           this.dispatch({
               type:DELETE_DATA,
               name:name,
               controllerName:this.controllerName,
               stateDefine:this.stateDefines[name],
               payLoad:payLoad
           });
           return this;
       } else {
           _throwNameIsNotExist(name,this.controllerName);
       }
   }

   insert(name,insertedItem,afterIndexOrKeyOrFunc) {
       var payLoad;
       if(this.stateDefines[name]){
           payLoad = _getPayLoad(afterIndexOrKeyOrFunc);
           payLoad.item = insertedItem;
           this.dispatch({
               type:INSERT_DATA,
               name:name,
               controllerName:this.controllerName,
               stateDefine:this.stateDefines[name],
               payLoad:payLoad
           });
           return this;
       } else {
           _throwNameIsNotExist(name,this.controllerName);
       }
   }

   update(name,updatedItem,indexOrKeyOrFunc) {
       var payLoad;
       if(this.stateDefines[name]){
           if(indexOrKeyOrFunc) {
               payLoad = _getPayLoad(indexOrKeyOrFunc);
               payLoad.item = updatedItem;
               this.dispatch({
                   type:UPDATE_DATA,
                   name:name,
                   controllerName:this.controllerName,
                   stateDefine:this.stateDefines[name],
                   payLoad:payLoad
               });
           }else{
               this.dispatch({
                   type:UPDATE_DATA,
                   name:name,
                   controllerName:this.controllerName,
                   state:this.stateDefines[name],
                   payLoad:{
                       item:updatedItem,
                       covered:true
                   }
               });
           }
       } else {
           _throwNameIsNotExist(name,this.controllerName);
       }
   }
}

