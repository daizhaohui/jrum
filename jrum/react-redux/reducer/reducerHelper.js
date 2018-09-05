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

const _checkDataItem = (item,modelName,propName,schema)=>{
    if(item[schema.treeOption.key]===undefined ||  item[schema.treeOption.children]===undefined || !Checker.isArray(item[schema.treeOption.children])){
        throw new Error(`模型${modelName}的属性${propName}的树状数据节点必须定义${schema.treeOption.key}和${schema.treeOption.children}两个属性且不能为空,其中${schema.treeOption.key}为字符串，${schema.treeOption.children}为数组类型:${JSON.stringify(item)}`); 
    }
}

const _checkTreeData = (data,modelName,propName,schema)=>{
    var items;

    items = data;
    if(schema.type===DataTypes.Object){
        _checkDataItem(data,modelName,propName,schema);
        items = data[schema.treeOption.children];
    } 
    const _recurveCheck = (children)=>{
        var i,len,item;
        len = children.length;
        for(i=0;i<len;i++){
            item = children[i];
            _checkDataItem(item,modelName,propName,schema);
            _recurveCheck(item[schema.treeOption.children]);
        }
    }

    _recurveCheck(items);
}

/*
    *检查指定的名称是否存在
    */
const  _check = (state,action)=>{
    var curState;
    if(action.name){
        curState = ReducerHelper.getModelState(state,action);
        if(typeof curState[action.name]==='undefined'){
            throw new Error(`模型${action.modelName}中不存在属性${action.name}`);
        }
        //tree数据结构检查
        if(action.schema.treeOption!==undefined){
            if(!action.schema.treeOption.key || !action.schema.treeOption.children){
                throw new Error(`模型${action.modelName}的属性${action.name}设置treeOption时,必须设置key和children的值`);
            }
            if(action.schema.type!==DataTypes.Object && action.schema.type!==DataTypes.Array) {
                throw new Error(`模型${action.modelName}的属性${action.name},如果设置treeOption值,type类型必须为DataTypes.Array或DataTypes.Object`);
            }
            _checkTreeData(curState[action.name],action.modelName,action.name,action.schema);
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
            return item[keyName] === value;
        };
        return ReducerHelper.findItemIndexPathByFunc(state,childrenPropName,rootIsObject,_comparyKey);
    }

    static createState(state,modelState,modelPropState,data,modelName,name,childrenPropName,rootIsObject){
        var result;
        if(data){
            if(rootIsObject){
                data = {
                    ...modelPropState,
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
        if(process.env.NODE_ENV==='development' || process.env.NODE_ENV==='test'){
            _check(state,action);
        }
    }
}