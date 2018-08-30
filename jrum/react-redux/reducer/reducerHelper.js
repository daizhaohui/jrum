import DataTypes from '../../model/dataTypes';
import Checker from '../../utils/checker';

const _findParentPathIndexInArray = (children,childrenName,func)=>{
    var result,k;
    result = "";
    k = 0;
    const _find = (children,indexPath)=>{
        var i,len,item,iPath;

        if(k===1){
            return;
        }
        len = children.length;
        for(i=0;i<len;i++){
            iPath = indexPath? `${indexPath}-${i}`: `${i}`;
            item = children[i];
            if(func(item)){  
                k = 1;
                result = iPath;
                break;
            } else {
                _find(item[childrenName],iPath);
            }
        }
    }
    _find(children,""); 
    if(k===1){
        result = result.split('-');
        for(k=0;k<result.length;k++){
            result[k] = parseInt(result[k]);
        }
    } else {
        result = [];
    }
    return result;
};

/*
    *检查指定的名称是否存在
    */
const  _check = (state,action)=>{
    var curState;
    if(action.name){
        curState = this.getModelState(state,action);
        if(typeof curState[action.name]===undefined){
            throw new Error(`模型【${action.modelName}】中不存在属性【${action.name}】`);
        }
    } 
};

export default class ReducerHelper {
   

    static dataTypeIsArray(action){
        return action.schema.type === DataTypes.Array
    }

    static dataTypeIsObject(action){
        return action.schema.type===DataTypes.Object
    }

    static getModelState(state,action){
        return state[action.modelName] || {};
    }

    static getModelPropState(state,action){
        return state[action.modelName][action.name] || {};
    }

    static parentIsEmpty(action){
        if(typeof action.parent === 'undefined') {
            return true;
        }
        return false;
    }

    static findItemIndexPathByFunc(state,childrenPropName,rootIsObject,func){
        var indexs,

        indexs =[];
        if(rootIsObject){
            if(func(state)){
                indexs = -1; //parent为根对象
            } else {
                indexs = _findParentPathIndexInArray(state[childrenPropName],childrenPropName,func);
            }
        } 
        //数组
        else{
            indexs = _findParentPathIndexInArray(state,childrenPropName,func);
        }
        return indexs;
    }

    static findItemIndexPath(state,value,keyName,childrenPropName,rootIsObject){
        var indexs,

        indexs =[];
        const _comparyKey = (item)=>{
            return item[keyName] == value;
        };
        return ReducerHelper.findItemIndexPathByFunc(state,childrenPropName,rootIsObject,_comparyKey);
    }

    static createState(state,modelState,data,modelName,name,childrenPropName,rootIsObject){
        var result;
        if(data){
            if(rootIsObject){
                data = {
                    ...state,
                    [childrenPropName]:data
                };
            } 
            result = {
                ...state,
                [modelName]:{
                    ...modelState,
                    ...{
                        [name]:data
                    }
                }
            };
        } else {
            result = state;
        }
        return result;
    }



    static execute(state,action){
        if(process.env.NODE_ENV==='development'){
            _check(state,action);
        }
    }
}