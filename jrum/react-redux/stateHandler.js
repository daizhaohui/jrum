import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA, INIT_DATA} from './actionTypes';
import Checker from '../utils/checker';
import ModelManager from '../model/modelManager';
import DataTypes from '../model/dataTypes';

const _StateHandlers = {

};

const _getPayLoad=(indexOrKeyOrFunc)=>{
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
};

const _check=(modelName,schema,name)=>{
    if(process.env.NODE_ENV==='development'){
        if(!schema[name]){
            throw new Error(`模型【${modelName}】未定义属性【${name}】`);
        }
        if(schema.treeOption!==undefined){
            if(!schema.treeOption.key || !schema.treeOption.children){
                throw new Error(`模型${modelName}的属性${name}设置treeOption时,必须设置key和children的值`);
            }
            if(schema.type!==DataTypes.Object && schema.type!==DataTypes.Array) {
                throw new Error(`模型${modelName}的属性${name},如果设置treeOption值,type类型必须为DataTypes.Array或DataTypes.Object`);
            }
        }
       
    }
};

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
    append(name,appendedItem,parent){
        _check(this.modelName,this.schema,name);
        this.dispatch({
            type:APPEND_DATA,
            name:name,
            modelName:this.modelName,
            schema:this.schema[name],
            parent:parent,
            payLoad:appendedItem
        });
   }

   delete(name,indexOrKeyOrFunc,parent) {
       var payLoad;
       _check(this.modelName,this.schema,name);
        payLoad = _getPayLoad(indexOrKeyOrFunc);
        this.dispatch({
            type:DELETE_DATA,
            name:name,
            modelName:this.modelName,
            schema:this.schema[name],
            parent:parent,
            payLoad:payLoad
        });

   }

   insert(name,insertedItem,afterIndexOrKeyOrFunc,parent) {
       var payLoad;

       _check(this.modelName,this.schema,name);
        payLoad = _getPayLoad(afterIndexOrKeyOrFunc);
        payLoad.item = insertedItem;
        this.dispatch({
            type:INSERT_DATA,
            name:name,
            modelName:this.modelName,
            schema:this.schema[name],
            payLoad:payLoad,
            parent:parent,
            isInsertBefore:false
        });
   }

   insertBefore(name,insertedItem,beforeIndexOrKeyOrFunc,parent){
        var payLoad;
        _check(this.modelName,this.schema,name);
        payLoad = _getPayLoad(beforeIndexOrKeyOrFunc);
        payLoad.item = insertedItem;
        this.dispatch({
            type:INSERT_DATA,
            name:name,
            modelName:this.modelName,
            schema:this.schema[name],
            payLoad:payLoad,
            parent:parent,
            isInsertBefore:true
        });
   }

   update(name,updatedItem,indexOrKeyOrFunc,parent) {
       var payLoad;

        _check(this.modelName,this.schema,name);
        if(indexOrKeyOrFunc) {
            payLoad = _getPayLoad(indexOrKeyOrFunc);
            payLoad.item = updatedItem;
            this.dispatch({
                type:UPDATE_DATA,
                name:name,
                modelName:this.modelName,
                schema:this.schema[name],
                payLoad:payLoad,
                parent:parent
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
                },
                parent:parent
            });
        }
   }
}

