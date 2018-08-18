import AppStore from '../react-redux/appStore';
import StateHandler from '../react-redux/stateHandler';
const _models = {

};
const _schems = {

}

export default class ModelManager {

    static isExist(name){
        return _models.hasOwnProperty(name);
    }

    static getModel(name){
       if(ModelManager.isExist(name)){
           return _models[name];
       }
      throw new Error(`名为${name}模型不存在！`)
    }

    static addModelSchemal(name,schema){
        _schems[name] = schema;
    }

    static getModelSchema(name){
        if(ModelManager.isExist(name)){
            return _schems[name];
        }
        throw new Error(`名为${name}模型不存在！`)
    }

    static addModel(name,model){
        _models[name] = model;
    }

    static initAllModelDefautValue(){
        var key,
            handler;

        for(key in _schems){
            handler = StateHandler.createHandler(AppStore.dispatch,key);
            handler.init();
        }
        
    }

}