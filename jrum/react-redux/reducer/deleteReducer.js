import Checker from '../../utils/checker';
import ReducerHelper from './reducerHelper';

const _filterDeletedArray = (items,pl)=>{
    var i,
        len,
        item,
        index,
        notBeDeletedItems=[];
    len = items.length;
    index = -1;
    for(i=0;i<len;i++){
        item = items[i];
        if(pl.func(item)===false){
            notBeDeletedItems.push(item);
        } else {
            index = i;
        }
    }
    if(len>0 && len-1!=notBeDeletedItems.length){
        return notBeDeletedItems;
    }
    return index;
};

const _getDelIndexOrArray=(items,pl)=>{
    if(items){
        if(pl.func!==undefined){
            return _filterDeletedArray(items,pl);
        }
        else if(pl.index!==undefined) {
            return pl.index;
        }
    }
    return -1;
};

const _filterDelelteObject=(obj,pl)=>{
    var key,
        name,
        notDeletedObj={},
        i =0;
    for(name in obj ) {
        if(pl.func(obj[name])===false){
            notDeletedObj[name] = obj[name];
        } else {
            i++;
            key = name;
        }
    }
    return i===0 ? "" : (i===1?key:notDeletedObj)
};

const _getDelKeyOrObject=(obj,pl)=>{
    var name;
    if(pl.key!==undefined) {
        for(name in obj ) {
            if(name===pl.key){
                return name;
            }
        }
    }
    else if(pl.func!==undefined){
        return _filterDelelteObject(obj,pl);
    }
    return "";
};

const _createChildrenStateByDeleteInCollection = (originState,childrenPropName,payLoad,indexs)=>{  
    const _createState = (state,arr)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){     
            indexOrObject = _getDelIndexOrArray(originState,payLoad); 
            //删除多条记录
            if(Checker.isArray(indexOrObject)){
                children = indexOrObject;
            }
            //删除单条记录  
            else if(indexOrObject>=0 && children.length>indexOrObject){
                children = [
                    ...children.slice(0,indexOrObject),
                    ...children.slice(indexOrObject+1)
                ];
            }
            newState = [
                ...state.slice(0,index),
                {
                  ...item,
                  [childrenPropName]:children
                },
                ...state.slice(index+1)
            ];
        } else {     
            newState = [
                ...state.slice(0,index),
                {
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

const _createChildrenStateByDeleteItem = (originState,childrenPropName,payLoad,indexs)=>{  
    const _createState = (state,arr)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){     
            newState = [
                ...state.slice(0,index),
                ...state.slice(index+1)
            ];
        } else  {     
            newState = [
                ...state.slice(0,index),
                {
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

const _createChildrenStateByDeleteMultiItems = (originState,childrenPropName,func)=>{  

    const _createState = (children)=>{
        var i,len,item,items,newState;

        items = [];
        len = children.length;
        isFinded = false;
        newState = children;
        for(i=0;i<Len;i++){
            item = children[i];
            if(!func(item)){
                items.push(item);
            }
        }
        if(items.length<children.length){
            newState = [...items];
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

const _findDeletedItemsIndexPath = (originState,childrenPropName,payLoad)=>{
    var deletedItemsFlag,func,name,result;

    func = payLoad.func;
    result = [];
    const _find = (children,indexPath)=>{
        var i,len,item,iPath;

        len = children.len;
        for(i=0;i<len;i++){
            iPath = indexPath? `${indexPath}-${i}`: `${i}`;
            item = children[i];
            if(func(item)===true){  
                if(!deletedItemsFlag[indexPath]){
                    deletedItemsFlag[iPath] = 1;
                    _find(item[childrenName],iPath);
                }
            } else {
                _find(item[childrenName],iPath);
            }
        }
    };
    _find(originState,"");
    for(name in deletedItemsFlag){
        result.push(name.split('-'));
    }
    return result;
};

export default class DeleteReducer{
    constructor(){
       
    }

    _treeExecute(state,action){
        var result,data,modelState,payLoad,childrenPropName,modelPropState,indexs,keyName,rootIsObject,value;

        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);
        payLoad = action.payLoad;
        childrenPropName = action.schema.treeOption.children;
        keyName = action.schema.treeOption.key;
        data = null;
        rootIsObject = this.dataTypeIsObject(action);
        value = action.parent;

        //在指定的父里找符合条件的元素进行删除
        if(value){
            //找到parent所在的索引路径
            indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            data = _createChildrenStateByDeleteInCollection(rootIsObject?state[childrenPropName]:state,childrenPropName,payLoad,indexs);
        } 
        //在tree中查找符合条件的元素进行删除
        else {
            value = payLoad.key || payLoad.index;
            //单个值查找
            if(value){
                indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
                //indexs=-1时表示删除的对象为根对象：忽略删除
                //indexs.lengh<=0 表示没找到删除目标
                if(indexs!==-1 && indexs.length>=1){
                    data = _createChildrenStateByDeleteItem(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs);
                }
            } 
            //按函数查找
            else if(payLoad.func){
                data = _createChildrenStateByDeleteMultiItems(modelPropState,childrenPropName,payLoad.func);
            } 
        }
        result = ReducerHelper.createState(state,modelState,data,action.modelName,action.name,childrenPropName,rootIsObject);
        return result;
    }

    _platExecute(state,action){
        var pl,currentState,result,indexOrObject,data;
       
        data = null;
        result = state;
        pl = action.payLoad;
        currentState = ReducerHelper.getModelState(state,action);

        if(currentState[action.name] && ReducerHelper.dataTypeIsArray(action)) {
            indexOrObject = _getDelIndexOrArray(currentState[action.name],pl);
            //删多条记录
            if(Checker.isArray(indexOrObject)){
                result = {
                    ...state,
                    [action.modelName]:{
                        ...currentState,
                        [action.name]:[...indexOrObject]
                    }
                };
                indexOrObject = null;
            }
            //删除单条记录
            else if(indexOrObject>=0 && currentState[action.name].length>indexOrObject){
                if(currentState[action.name].length===1){
                    data = [];
                } else if(currentState[action.name].length===indexOrObject+1){
                    data = [...(currentState[action.name].slice(0,indexOrObject))];
                } else {
                    data = [
                        ...(currentState[action.name].slice(0,indexOrObject)),
                        ...(currentState[action.name].slice(indexOrObject+1))
                    ];
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
        else if(currentState[action.name] && this.dataTypeIsObject(action)) {
            indexOrObject = _getDelKeyOrObject(currentState[action.name],pl);
            if(indexOrObject===""){
                data = null;
            }
            else if(Checker.isString(indexOrObject)) {
                data = {
                    ...(currentState[action.name])
                };
                delete data[indexOrObject];
            }
            else{
                data = {...(indexOrObject)};
            }
            result = data ? {
                ...state,
                [action.modelName]:{
                        ...currentState,
                        [action.name]:data
                    }
                } : {...state};
            indexOrObject = null;
        }
        return result;
    }

    execute(state,action){
        ReducerHelper.execute(state,action);
        if(action.schema.treeOption!==undefined){
            return this._treeExecute(state,action);
        }else {
            return this._platExecute(state,action);
        }
    }
}