import Checker from '../../utils/checker';
import ReducerHelper from './reducerHelper';

const _findArrayInsertIndex=(items,func)=>{
    var i,
        len = items.length;
    for(i=0;i<len;i++){
        if(func(items[i])===true){
            return i+1;
        }
    }
    return -1;
};

const _getArrayInsertIndex=(items,pl)=>{
    if(items){
        if(pl.index!==undefined){
            return pl.index;
        }else if(pl.func !==undefined){
            return _findArrayInsertIndex(items,pl.func);
        }
    }
    return -1;
};

const _createChildrenState = (state,payLoad,isInsertBefore,isArray)=>{
    var data,index;

    data = state;
    index = _getArrayInsertIndex(state,payLoad);
    if(index!==-1){
        if(isInsertBefore){
            data = isArray ? [
                ...state.slice(0,index),
                ...payLoad,
                ...state.slice(index)
            ] : [
                ...state.slice(0,index),
                payLoad,
                ...state.slice(index)
            ];
        } else {
            data = isArray ? [
                ...state.slice(0,index+1),
                ...payLoad,
                ...state.slice(index+1)
            ] : [
                ...state.slice(0,index+1),
                payLoad,
                ...state.slice(index+1)
            ];
        }
    }
    return data;
};


const _createChildrenStateByInsert = (originState,childrenPropName,payLoad,indexs,isInsertBefore,isArray)=>{  
    const _createState = (state,arr)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){     
           newState = _createChildrenState(children,payLoad,isInsertBefore,isArray);
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

export default class InsertReducer{
    constructor(){
        
    }

    _platExecute(state,action){
        var pl,
        currentState,
        result,
        data,
        len,
        index;

        result = state;
        pl =  action.payLoad;
        currentState = ReducerHelper.getModelState(state,action);

        if(!ReducerHelper.dataTypeIsArray(action)) {
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
            if(action.isInsertBefore===true){
                data = [
                    ...pl.item,
                    ...currentState[action.name].slice(0,index),
                    ...currentState[action.name].slice(index)
                ];
            } else {
                data = [
                    ...currentState[action.name].slice(0,index),
                    ...pl.item,
                    ...currentState[action.name].slice(index)
                ];
            }
           
        }
        //插入单项
        else {
            if(action.isInsertBefore===true){
                data = [
                    pl.item,
                    ...currentState[action.name].slice(0,index),
                    ...currentState[action.name].slice(index)
                ];
            } else {
                data = [
                    ...currentState[action.name].slice(0,index),
                    pl.item,
                    ...currentState[action.name].slice(index)
                ];
            }
           
        }
        result = {
            ...state,
            [action.modelName]:{
                ...currentState,
                ...{
                    [action.name]:data
                }
            }
        }
        return result;
    }

    _treeExecute(state,action){
        var result,data,modelState,payLoad,childrenPropName,modelPropState,indexs,keyName,rootIsObject,value,isInsertBefore,isArray;

        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);
        payLoad = action.payLoad;
        childrenPropName = action.schema.treeOption.children;
        keyName = action.schema.treeOption.key;
        data = null;
        rootIsObject = ReducerHelper.dataTypeIsObject(action);
        value = action.parent;
        isArray = Checker.isArray(payLoad);
        isInsertBefore = action.isInsertBefore;

        //指定了parent
        if(value) {
            indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            if(indexs===-1){
                data = _createChildrenState(modelPropState[childrenPropName],payLoad,isInsertBefore,isArray);     
            } else if(indexs.length>0){
                data = _createChildrenStateByInsert(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs,isInsertBefore,isArray);
            }
        } 
        //查找这个树
        else {
            value = action.key;
            if(value){
                indexs = ReducerHelper.findItemIndexPath(modelPropState,value,keyName,childrenPropName,rootIsObject);
            } else if(action.func){
                indexs = ReducerHelper.findItemIndexPathByFunc(modelPropState,childrenPropName,rootIsObject,action.func);
            }
            
            if(indexs!==-1){
                data = _createChildrenState(modelPropState[childrenPropName],payLoad,isInsertBefore,isArray);  
            } else if(indexs.length>0){
                data = data = _createChildrenStateByInsert(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs,isInsertBefore,isArray);
            }
        }
        result = ReducerHelper.createState(state,modelState,data,action.modelName,action.name,childrenPropName,rootIsObject);
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