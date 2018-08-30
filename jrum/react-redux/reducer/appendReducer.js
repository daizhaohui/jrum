import Checker from '../../utils/checker';
import ReducerHelper from './reducerHelper';

const _createObjectNewStateOfCollection = (originState,treeChildrenName,payLoad)=>{
    if(Checker.isArray(payLoad)){
        data = {
            ...originState,
            ...{
                [treeChildrenName]:[
                    ...originState[treeChildrenName],
                    ...payLoad
                ]
            }
        };
    } else {
        data = {
            ...originState,
            ...{
                [treeChildrenName]:[
                    ...originState[treeChildrenName],
                    payLoad
                ]
            }
        };
    }
    return data;
};

const _createChildrenStateByAppend=(originState,childrenPropName,payLoad,indexs)=>{  
    var arr = indexs;
    const _createState = (state)=>{
        var children,index,item,newState;
        index = arr[0];
        item = state[index];
        children = item[childrenPropName];
        if(arr.length===1){             
            children = Checker.isArray(payLoad) ? [...children,...payLoad] :  [...children,payLoad];
            newState = [
                ...state.slice(0,index),
                {
                  ...item,
                  [childrenPropName]:children
                },
                ...state.slice(index+1)
            ];
        } else {     
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
    };
    return _createState(originState,indexs);
};

export default class AppendReducer{

    constructor(){
        
    }

    _treeExecute(state,action){
        var result,data,modelState,payLoad,childrenPropName,modelPropState,indexs,value,rootIsObject,keyName;

        modelState = ReducerHelper.getModelState(state,action);
        modelPropState = ReducerHelper.getModelPropState(state,action);
        payLoad = action.payLoad;
        childrenPropName = action.schema.treeOption.children;
        keyName = action.schema.treeOption.key;
        data = null;
        rootIsObject = ReducerHelper.dataTypeIsObject(action);
        value = action.parent;
        //没有指定父，直接在根节点追加
        if(ReducerHelper.parentIsEmpty(action)) {
            if(rootIsObject){
                data = _createNewStateOfCollection(modelPropState,childrenPropName,payLoad);
            } else {
                data = Checker.isArray(payLoad) ? [...modelPropState,...payLoad] : [...modelPropState,payLoad];
            } 
        } 
        //查找到父，进行追加
        else {
            indexs = ReducerHelper.findItemIndexPath(modelPropState,action.parent,keyName,childrenPropName,rootIsObject);
            if(indexs!==-1 && indexs.length>=1){
                data = _createChildrenStateByAppend(rootIsObject?modelPropState[childrenPropName]:modelPropState,childrenPropName,payLoad,indexs);
            }
            //parent为根对象
            else if(indexs===-1){
                data =_createObjectNewStateOfCollection(modelPropState,childrenPropName,payLoad);
            }

        }  
        result = ReducerHelper.createState(state,modelState,modelPropState,data,action.modelName,action.name,childrenPropName,rootIsObject);
        return result;
    }

    _platExecute(state,action){
        var result,data,currentState;

        currentState = ReducerHelper.getModelState(state,action);
        result = state;
        if(ReducerHelper.dataTypeIsArray(action)) {
            //添加的是集合
            if(Checker(action.payLoad)){
                data = [...currentState[action.name],...(action.payLoad)]
            } else {
                data = [...currentState[action.name],action.payLoad]
            }
            result = {
                ...state,
                [action.modelName]:{
                    ...currentState,
                    ...{
                        [action.name]:data
                    }
                }
            };
        } else if(ReducerHelper.dataTypeIsObject(action)) {
            result = {
                ...state,
                [action.modelName]:{
                    ...currentState,
                    ...{
                        [action.name]:{
                            ...currentState[action.name],
                            ...(action.payLoad)
                        }
                    }
                }
            };
        }
        return result;
    }

    execute(state,action){
        ReducerHelper.execute(state,action);
        if(action.schema.treeOption!==undefined){
            return this._treeExecute(state,action);
        } else {
            return this._platExecute(state,action);
        }
    }

}