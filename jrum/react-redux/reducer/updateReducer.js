import Checker from '../../utils/checker';
import ReducerHelper from './reducerHelper';

const _findUpdatedItemIndexs=(items,func)=>{
    var i,
        len,
        indexs=[];
    len = items.length;
    for(i=0;i<len;i++){
        if(func(items[i])===true){
            indexs.push(i);
        }
    }
    return indexs.length>0 ?indexs:[-1];
};

const _getUpdateArrayIndexs=(items,pl)=>{
    if(items){
        if(pl.func!==undefined){
            return _findUpdatedItemIndexs(items,pl.func);
        }
        else if(pl.index!==undefined) {
            return [pl.index];
        }
    }
    return [-1];
};

const _findUpdatedItemKeys=(obj,func)=>{
    var name,
        keys = [];
    for(name in obj){
        if(func(obj[name])===true){
            keys.push(name);
        }
    }
    return keys;
};

const _getUpdateObjectKeys=(obj,pl)=>{
    if(obj){
        if(pl.func!==undefined){
            return _findUpdatedItemKeys(obj,pl.func);
        }
        else if(pl.key!==undefined) {
            return [pl.key];
        }
    }
    return [];
};

const _createChildrenStateByUpdate = (originState,childrenPropName,payLoad,indexs)=>{  
    var updateItem = payLoad.covered?{}:payLoad.item;

    const _createState = (state,arr)=>{
        var children,index,item,newState,indexOrKeys,indexOrKey;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){     
            indexOrKeys = _getUpdateArrayIndexs(children,payLoad);
            //修改单条记录
            if(indexOrKeys.length===1 && indexOrKey>=0 && children.length>indexOrKey){
                updateItem = {...(children[indexOrKey]),...updateItem} 
                newState = [...children.slice(0,indexOrKey),
                    updateItem,
                    ...children.slice(indexOrKey+1)
                ];
            }
            //修改多条记录
            else if(indexOrKeys.length>1){
                newState = [...children];
                for(indexOrKey=0;indexOrKey<indexOrKeys.length;indexOrKey++){
                    newState[indexOrKeys[indexOrKey]] = {...(newState[indexOrKeys[indexOrKey]]),...updateItem};
                }
            } else {
                newState = children;
            }
        } else  {     
            newState = [
                ...state.slice(0,index),
                ...{
                  ...item,
                  [childrenPropName]:_createState(children,arr.splice(0,1))
                },
                ...state.slice(index+1)
            ];
        }
        return newState;
    }
    return _createState(originState,indexs);
};

const _createChildrenStateByUpdateItem = (originState,childrenPropName,payLoad,indexs)=>{ 
    var updateItem = payLoad.covered?{}:payLoad.item;
    var arr = indexs;
    const _createState = (state)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){     
            updateItem = {...(children[index]),...updateItem};
            newState = [...children.slice(0,index),
                updateItem,
                ...children.slice(index+1)
            ];
        } else  {     
            arr.splice(0,1);
            newState = [
                ...state.slice(0,index),
                {
                  ...item,
                  [childrenPropName]:_createState(children)
                },
                ...state.slice(index+1)
            ];
        }
        return newState;
    }
    return _createState(originState,indexs);
};

const _createChildrenStateByUpdateMultiItems = (originState,childrenPropName,payLoad,func)=>{  
    var updateItem = payLoad.covered?{}:payLoad.item;
    const _createState = (children)=>{
        var i,len,item,items,newState,updatedIndexs;

        updatedIndexs = [];
        len = children.length;
        isFinded = false;
        newState = children;
        for(i=0;i<Len;i++){
            item = children[i];
            if(!func(item)){
                updatedIndexs.push(i);
            }
        }
        if(items.length<children.length){
            newState = [...children];
            for(i=0;i<updatedIndexs.length;i++){
                newState[updatedIndexs[i]] = {...(newState[updatedIndexs[i]]),...updateItem};
            }
        }   
        for(i=0;i<len;i++){
            item = children[i];
            newState = [
                ...newState.slice(0,i),
                {
                    ...item,
                    [childrenPropName]:_createState(item[childrenPropName])

                },
                ...newState.slice(i+1)        
            ];
        }
        return newState;
    }
    return _createState(originState);
};

const _createObjectState = (modelPropState,payLoad)=>{
    if(payLoad.covered){
        return payLoad.item;
    } else {
        return {
            ...modelPropState,
            ...payLoad.item
        }
    }
};


export default class UpdateReducer{
    constructor(){
    
    }

    _treeExecute(state,action){
        var result,data,modelState,payLoad,childrenPropName,modelPropState,indexs,keyName,rootIsObject,value,isArray;

        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);
        payLoad = action.payLoad;
        childrenPropName = action.schema.treeOption.children;
        keyName = action.schema.treeOption.key;
        data = null;
        rootIsObject = ReducerHelper.dataTypeIsObject(action);
        value = action.parent;
        isArray = Checker.isArray(payLoad);

        if(value){
            indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            if(indexs===-1){
                data = _createObjectState(modelPropState,payLoad);     
            } else if(indexs.length>0){
                data = _createChildrenStateByUpdate(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs);
            }
        } else {
            value = payLoad.key;
            //单个值查找
            if(value){
                indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
                //indexs.lengh<=0 表示没找到删除目标
                if(indexs===-1){
                    data = _createObjectState(modelPropState,payLoad);     
                }
                else if(indexs.length>=1){
                    data = _createChildrenStateByUpdateItem(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs);
                }
            } 
            //按函数查找
            else if(payLoad.func){
                data = _createChildrenStateByUpdateMultiItems(modelPropState,childrenPropName,payLoad,payLoad.func);
            } 
        }
        result = ReducerHelper.createState(state,modelState,modelPropState,data,action.modelName,action.name,childrenPropName,rootIsObject);
        return result;
    }

    _platExecute(state,action){
        var pl,
        currentState,
        result = state,
        data,
        indexOrKeys,
        indexOrKey,
        isPlainObject,
        hasOwnProperty;

        
        pl =  action.payLoad;
        currentState = ReducerHelper.getModelState(state,action);
        isPlainObject = Checker.isPlainObject(pl.item);
        hasOwnProperty = isPlainObject && !Checker.isEmptyObject(pl.item) ? true : false;

        //直接覆盖值
        if(pl.covered) {
            return {
                ...state,
                [action.modelName]:{
                    ...currentState,
                    [action.name]:pl.item
                }
            };
        }

        if(ReducerHelper.dataTypeIsArray(action) && currentState[action.name]) {
            indexOrKeys = _getUpdateArrayIndexs(currentState[action.name],pl);
            indexOrKey = indexOrKeys[0];
            //修改单条记录
            if(indexOrKeys.length===1 && indexOrKey>=0 && currentState[action.name].length>indexOrKey){
                data = isPlainObject ? (hasOwnProperty?{...(currentState[action.name][indexOrKey]),...(pl.item)} : {}) : pl.item;
                data = currentState[action.name].length===indexOrKey+1 ? [...currentState[action.name].slice(0,indexOrKey), data]:[
                    ...currentState[action.name].slice(0,indexOrKey),
                    data,
                    ...currentState[action.name].slice(indexOrKey+1)
                ];

                result = {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:data
                    }
                };
            }
            //修改多条记录
            else if(indexOrKeys.length>1){
                data = [...currentState[action.name]];
                for(indexOrKey=0;indexOrKey<indexOrKeys.length;indexOrKey++){
                    if(isPlainObject){
                        data[indexOrKeys[indexOrKey]] = hasOwnProperty ? {...(data[indexOrKeys[indexOrKey]]),...(pl.item)} : {}
                    } else {
                        data[indexOrKeys[indexOrKey]] = pl.item;
                    }
                }
                result = {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:data
                    }
                };
            }
        }
        else if(ReducerHelper.dataTypeIsObject(action) && currentState[action.name]) {
            indexOrKeys = _getUpdateObjectKeys(currentState[action.name],pl);
            indexOrKey = indexOrKeys.length>0 ? indexOrKeys[0] : '';
            if(indexOrKeys.length===1 && indexOrKey){
                data = isPlainObject ? (hasOwnProperty ? {...(currentState[action.name][indexOrKey]),...(pl.item)} : {}) : pl.item;
                result =  {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:{
                            ...(currentState[action.name]),
                            [indexOrKey]:data
                        }
                    }
                };
            } else if(indexOrKeys.length>1){
                data = {};
                for(indexOrKey=0;indexOrKey<indexOrKeys.length;indexOrKey++){
                    data[indexOrKeys[indexOrKey]] = isPlainObject ? (hasOwnProperty ? {...(currentState[action.name][indexOrKeys[indexOrKey]]),...(pl.item)} : {}) : pl.item;
                }
                result =  {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:{
                            ...(currentState[action.name]),
                            ...(data)
                        }
                    }
                };
            }
        } else {
            if(Checker.isValue(pl.item)){
                result = {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:pl.item
                    }
                };
            }
        }
        return result;
    }
/*
*修改：1.如果修改的目标为对象，修改的值将与原有的值进行合并，类同Object.assign(source,target),
*除一种情况列外，如果target为{},那最终被修改的值也被修改为{}
 */
    execute(state,action){    
        ReducerHelper.execute(state,action);
        if(action.schema.treeOption!==undefined){
            return this._treeExecute(state,action);
        }else {
            return this._platExecute(state,action);
        }
    }
}