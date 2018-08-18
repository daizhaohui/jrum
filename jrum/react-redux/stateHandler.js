import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA, INIT_DATA} from './actionTypes';
import Checker from '../utils/checker';
import ModelManager from '../model/modelManager';

const _StateHandlers = {

};

function _throwNameIsNotExist(name,modelName) {
    throw new Error(`Model [${modelName}] is not define [${name}].`);
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

import StateInitializer from './stateInitializer';
export  default  class  StateHandler {

    static createHandler(dispatch,modelName){
        if(!_StateHandlers[modelName]){
            _StateHandlers[modelName] = new StateHandler(dispatch,modelName,ModelManager.getModelSchema(modelName));
        }
        return _StateHandlers[modelName];
    }

    constructor(dispatch,modelName,schema){
        this.dispatch = dispatch;
        this.modelName = modelName;
        this.schema = schema;
    }

    init(){
        var si = new StateInitializer(this.modelName,this.schema);
        this.dispatch({
            type:INIT_DATA,
            payLoad:si.getValue()
        })
    }

    /*
    给集合对象中添加数据，
     */
    append(name,appendedItem){
       if(this.schema[name]){
            this.dispatch({
                type:APPEND_DATA,
                name:name,
                modelName:this.modelName,
                schema:this.schema[name],
                payLoad:appendedItem
            })
       } else {
           _throwNameIsNotExist(name,this.modelName);
       }
   }

   delete(name,indexOrKeyOrFunc) {
       var payLoad;
       if(this.schema[name]){
           payLoad = _getPayLoad(indexOrKeyOrFunc);
           this.dispatch({
               type:DELETE_DATA,
               name:name,
               modelName:this.modelName,
               schema:this.schema[name],
               payLoad:payLoad
           });
       } else {
           _throwNameIsNotExist(name,this.modelName);
       }
   }

   insert(name,insertedItem,afterIndexOrKeyOrFunc) {
       var payLoad;
       if(this.schema[name]){
           payLoad = _getPayLoad(afterIndexOrKeyOrFunc);
           payLoad.item = insertedItem;
           this.dispatch({
               type:INSERT_DATA,
               name:name,
               modelName:this.modelName,
               schema:this.schema[name],
               payLoad:payLoad
           });
       } else {
           _throwNameIsNotExist(name,this.modelName);
       }
   }

   update(name,updatedItem,indexOrKeyOrFunc) {
       var payLoad;
       if(this.schema[name]){
           if(indexOrKeyOrFunc) {
               payLoad = _getPayLoad(indexOrKeyOrFunc);
               payLoad.item = updatedItem;
               this.dispatch({
                   type:UPDATE_DATA,
                   name:name,
                   modelName:this.modelName,
                   schema:this.schema[name],
                   payLoad:payLoad
               });
           }else{
               this.dispatch({
                   type:UPDATE_DATA,
                   name:name,
                   modelName:this.modelName,
                   schema:this.schema[name],
                   payLoad:{
                       item:updatedItem,
                       covered:true
                   }
               });
           }
       } else {
           _throwNameIsNotExist(name,this.modelName);
       }
   }
}

