import AppStore from '../react-redux/appStore'
import StateHandler from '../react-redux/stateHandler';

export default class Model {
    constructor(modelName,schema){
        this.__modelName__ = modelName;
        this.__schema__ = schema;
    }

    append(name,appendedItem,parent){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.append(name,appendedItem,parent);
    }

    delete(name,indexOrKeyOrFunc,parent){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.delete(name,indexOrKeyOrFunc,parent);
    }

    insert(name,insertedItem,afterIndexOrKeyOrFunc,parent){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.insert(name,insertedItem,afterIndexOrKeyOrFunc,parent);
    }

    insertBefore(name,insertedItem,beforeIndexOrKeyOrFunc,parent){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.insertBefore(name,insertedItem,beforeIndexOrKeyOrFunc,parent);
    }

    update(name,updatedItem,indexOrKeyOrFunc,parent){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.update(name,updatedItem,indexOrKeyOrFunc,parent);
    }

}