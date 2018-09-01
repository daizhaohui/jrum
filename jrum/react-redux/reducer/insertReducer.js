import Checker from '../../utils/checker';
import ReducerHelper from './reducerHelper';

const _findArrayInsertIndex=(items,func)=>{
    var i,
        len = items.length;
    for(i=0;i<len;i++){
        if(func(items[i])===true){
            return i;
        }
    }
    return -1;
};

const _getArrayInsertIndex=(items,pl,keyName)=>{
    if(items){
        if(pl.index!==undefined){
            return pl.index;
        }
        else if(pl.key!==undefined && keyName!==undefined){
            return _findArrayInsertIndex(items,(item)=>{
                return item[keyName]===pl.key;
            });
        }
       else if(pl.func !==undefined){
            return _findArrayInsertIndex(items,pl.func);
        }
    }
    return -1;
};

const _createChildrenStateByIndex = (state,index,item,isInsertBefore,isArray)=>{
    var data,index;

    data = state;
    if(index!==-1){
        if(isInsertBefore){
            data = isArray ? [
                ...state.slice(0,index),
                ...item,
                ...state.slice(index)
            ] : [
                ...state.slice(0,index),
                item,
                ...state.slice(index)
            ];
        } else {
            data = isArray ? [
                ...state.slice(0,index+1),
                ...item,
                ...state.slice(index+1)
            ] : [
                ...state.slice(0,index+1),
                item,
                ...state.slice(index+1)
            ];
        }
    }
    return data;
};

const _createChildrenStateByInsertToParent = (originState,childrenPropName,keyName,payLoad,indexs,isInsertBefore,isArray)=>{  
    var arr = indexs;
    const _createState = (state)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){    
           newState = _createChildrenStateByIndex(children,_getArrayInsertIndex(children,payLoad,keyName),payLoad.item,isInsertBefore,isArray);
           newState = [
            ...state.slice(0,index),
            {
              ...item,
              [childrenPropName]:newState
            },
            ...state.slice(index+1)
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
    return _createState(originState);
};

const _createChildrenStateByInsert = (originState,childrenPropName,payLoad,indexs,isInsertBefore,isArray)=>{  
    var arr = indexs;
    const _createState = (state)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        if(arr.length===1){    
           children = state;
           newState = _createChildrenStateByIndex(children,index,payLoad.item,isInsertBefore,isArray);
        } else  {     
            arr.splice(0,1);
            children = item[childrenPropName];
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
    return _createState(originState);
};

export default class InsertReducer{
    constructor(){
        
    }

    _platExecute(state,action){
        var pl,
        modelState,
        modelPropState,
        result,
        data,
        len,
        index;

        result = state;
        pl =  action.payLoad;
        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);

        if(!ReducerHelper.dataTypeIsArray(action)) {
            return  state;
        }

        len = modelState[action.name].length;
        index = _getArrayInsertIndex(modelPropState,pl);
        if(index<0 ) {
            return  state;
        }

        if(len < index) {
            index = len - 1 <= 0 ? 0 : len-1;
        }
        data = _createChildrenStateByIndex(modelPropState,index,pl.item,action.isInsertBefore,Checker.isArray(pl.item));
        result = {
            ...state,
            [action.modelName]:{
                ...modelState,
                ...{
                    [action.name]:data
                }
            }
        }
        return result;
    }

    _treeExecute(state,action){
        var result,data,modelState,payLoad,childrenPropName,modelPropState,indexs,keyName,value,rootIsObject,isInsertBefore,isArray;

        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);
        payLoad = action.payLoad;
        childrenPropName = action.schema.treeOption.children;
        keyName = action.schema.treeOption.key;
        data = null;
        rootIsObject = ReducerHelper.dataTypeIsObject(action);
        isArray = Checker.isArray(payLoad.item);
        isInsertBefore = action.isInsertBefore;
       
        //指定了parent
        if(!ReducerHelper.parentIsEmpty(action)) {
            value = action.parent;
            indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            if(indexs===-1){
                value = _getArrayInsertIndex(modelPropState[childrenPropName],payLoad,keyName);
                data = _createChildrenStateByIndex(modelPropState[childrenPropName],value,payLoad.item,isInsertBefore,isArray);     
            } else if(indexs.length>0){
                data = _createChildrenStateByInsertToParent(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,keyName,payLoad,indexs,isInsertBefore,isArray);
            }
        } 
        //查找这个树
        else {
            value = payLoad.key || payLoad.index;
            if(value!==undefined){
                indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            } else if(payLoad.func){
                indexs = ReducerHelper.findItemIndexPathByFunc(modelPropState,childrenPropName,rootIsObject,payLoad.func);
            }
       
            if(indexs===-1){
                value = modelPropState[childrenPropName].length-1;
                value = value <0 ? 0:value;
                data = _createChildrenStateByIndex(modelPropState[childrenPropName],value,payLoad.item,isInsertBefore,isArray);  
            } else if(indexs!==-1 && indexs.length>0){
                data = _createChildrenStateByInsert(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs,isInsertBefore,isArray);
            }
            
        }
        result = ReducerHelper.createState(state,modelState,modelPropState,data,action.modelName,action.name,childrenPropName,rootIsObject);
        return result;
    }

    /*
    插入：index=0,在数组最前面开始插入。index=1，在第一个元素后面开始插入
    */
    execute(state,action){  
        ReducerHelper.execute(state,action);
        if(action.schema.treeOption!==undefined){
            return this._treeExecute(state,action);
        } else {
            return this._platExecute(state,action);
        }
    }
}