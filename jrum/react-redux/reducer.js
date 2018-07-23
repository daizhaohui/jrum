import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA,INIT_DATA} from './actionTypes';
import DataTypes from './dataTypes';
import Checker from '../utils/checker';

function _getCurrentState(state,action) {
    return state[action.controllerName] || {};
}

/*
追加
 */
function _append(state,action){
    var currentState,
        result = state,
        data;
    currentState = _getCurrentState(state,action);
    if(action.stateDefine.dataType===DataTypes.Array) {
        //添加的是集合
        if(Checker.isArray(action.payLoad)){
            data = [...currentState[action.name],...(action.payLoad)]
        } else {
            data = [...currentState[action.name],action.payLoad]
        }
        result = {
            ...state,
            [action.controllerName]:{
                ...currentState,
                ...{
                    [action.name]:data
                }
            }
        }
    } else if(action.stateDefine.dataType===DataTypes.Object) {
        result = {
            ...state,
            [action.controllerName]:{
                ...currentState,
                ...{
                    [action.name]:{
                        ...currentState[action.name],
                        ...(action.payLoad)
                    }
                }
            }
        }
    }
    return result
}

/*删除*/
function _filterDeletedArray(items,pl){
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
}

function _getDelIndexOrArray(items,pl) {
    if(items){
        if(pl.func!==undefined){
            return _filterDeletedArray(items,pl);
        }
        else if(pl.index!==undefined) {
            return pl.index;
        }
    }
    return -1;
}

function _filterDelelteObject(obj,pl){
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
}

function _getDelKeyOrObject(obj,pl) {
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
}

/*
删除
 */
function _delete(state,action){
    var pl,
        currentState,
        result = state,
        indexOrObject,
        data = null;

    pl = action.payLoad;
    currentState = _getCurrentState(state,action);

    if(currentState[action.name] && action.stateDefine.dataType===DataTypes.Array) {
        indexOrObject = _getDelIndexOrArray(currentState[action.name],pl);
        //删多条记录
        if(Checker.isArray(indexOrObject)){
            result = {
                ...state,
                [action.controllerName]:{
                    ...currentState,
                    [action.name]:[...indexOrObject]
                }
            }
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
                [action.controllerName]:{
                    ...currentState,
                    [action.name]:data
                }
            }
        }
    }
    else if(currentState[action.name] && action.stateDefine.dataType===DataTypes.Object) {
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
            [action.controllerName]:{
                    ...currentState,
                    [action.name]:data
                }
            } : {...state};
        indexOrObject = null;
    }
    return result
}

function _findUpdatedItemIndexs(items,func) {
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
}

function _getUpdateArrayIndexs(items,pl){
    if(items){
        if(pl.func!==undefined){
            return _findUpdatedItemIndexs(items,pl.func);
        }
        else if(pl.index!==undefined) {
            return [pl.index];
        }
    }
    return [-1];
}

function _findUpdatedItemKeys(obj,func) {
    var name,
        keys = [];
    for(name in obj){
        if(func(obj[name])===true){
            keys.push(name);
        }
    }
    return keys;
}

function _getUpdateObjectKeys(obj,pl){
    if(obj){
        if(pl.func!==undefined){
            return _findUpdatedItemKeys(obj,pl.func);
        }
        else if(pl.key!==undefined) {
            return [pl.key];
        }
    }
    return [];
}

/*
修改：1.如果修改的目标为对象，修改的值将与原有的值进行合并，类同Object.assign(source,target),除一种情况列外，如果target为{},那最终被修改的值也被修改为{}
 */
function _update(state,action){
    var pl,
        currentState,
        result = state,
        data,
        indexOrKeys,
        indexOrKey,
        isPlainObject,
        hasOwnProperty;

    pl =  action.payLoad;
    currentState = _getCurrentState(state,action);
    isPlainObject = Checker.isPlainObject(pl.item);
    hasOwnProperty = isPlainObject && !Checker.isEmptyObject(pl.item) ? true : false;

    //直接覆盖值
    if(pl.covered) {
        return {
            ...state,
            [action.controllerName]:{
                ...currentState,
                [action.name]:pl.item
            }
        }
    }

    if(action.stateDefine.dataType===DataTypes.Array && currentState[action.name]) {
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
                [action.controllerName]:{
                    ...currentState,
                    [action.name]:data
                }
            }
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
                [action.controllerName]:{
                    ...currentState,
                    [action.name]:data
                }
            }
        }
    }
    else if(action.stateDefine.dataType===DataTypes.Object && currentState[action.name]) {
        indexOrKeys = _getUpdateObjectKeys(currentState[action.name],pl);
        indexOrKey = indexOrKeys.length>0 ? indexOrKeys[0] : '';
        if(indexOrKeys.length===1 && indexOrKey){
            data = isPlainObject ? (hasOwnProperty ? {...(currentState[action.name][indexOrKey]),...(pl.item)} : {}) : pl.item;
            result =  {
                ...state,
                [action.controllerName]:{
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
                [action.controllerName]:{
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
                [action.controllerName]:{
                    ...currentState,
                    [action.name]:pl.item
                }
            }
        }
    }
    return result;
}

function _findArrayInsertIndex(items,func){
    var i,
        len = items.length;
    for(i=0;i<len;i++){
        if(func(items[i])===true){
            return i+1;
        }
    }
    return -1;
}

function _getArrayInsertIndex(items,pl) {
    if(items){
        if(pl.index!==undefined){
            return pl.index;
        }else if(pl.func !==undefined){
            return _findArrayInsertIndex(items,pl.func);
        }
    }
    return -1;
}

/*
插入：index=0,在数组最前面开始插入。index=1，在第一个元素后面开始插入
 */
function _insert(state,action) {
    var pl,
        currentState,
        result,
        data,
        len,
        index;

    result = state;
    pl =  action.payLoad;
    currentState = _getCurrentState(state,action);


    if(action.stateDefine.dataType !== DataTypes.Array) {
        return  state;
    }

    len = currentState[action.name].length;
    index = _getArrayInsertIndex(currentState[action.name],pl);
    if(index<0 ) {
        return  state;
    }

    if(len < index) {
        index = len - 1 <= 0 ? 0 : len;
    }

    //插入多项
    if(Checker.isArray(pl.item)) {
        data = [...currentState[action.name].slice(0,index),
            ...pl.item,
            ...currentState[action.name].slice(index)
        ];
    }
    //插入单项
    else {
        data = [
            ...currentState[action.name].slice(0,index),
            pl.item,
            ...currentState[action.name].slice(index)];
    }
    result = {
        ...state,
        [action.controllerName]:{
            ...currentState,
            ...{
                [action.name]:data
            }
        }
    }
    return result;
}

function _initData(state,action){
    var result = {
        ...state,
        ...(action.payLoad)
    };
    return result;
}

export default function Reducer(state={},action) {
    var result;
    switch(action.type){
        case APPEND_DATA:
            result = _append(state,action);
            break;
        case DELETE_DATA:
            result = _delete(state,action);
            break;
        case UPDATE_DATA:
            result = _update(state,action);
            break;
        case INSERT_DATA:
            result = _insert(state,action);
            break;
        case INIT_DATA:
            result = _initData(state,action);
            break;
        default:
            result = state;
    }
    return result;

}