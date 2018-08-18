import AppStore from '../react-redux/appStore'
import StateHandler from '../react-redux/stateHandler';

export default class Model {
    constructor(modelName,schema){
        this.__modelName__ = modelName;
        this.__schema__ = schema;
    }

    append(name,appendedItem){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.append(name,appendedItem);
    }

    delete(name,indexOrKeyOrFunc){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.delete(name,indexOrKeyOrFunc);
    }

    insert(name,insertedItem,afterIndexOrKeyOrFunc){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.insert(name,insertedItem,afterIndexOrKeyOrFunc);
    }

    update(name,updatedItem,indexOrKeyOrFunc){
        var handler = StateHandler.createHandler(AppStore.dispatch,this.__modelName__);
        handler.update(name,updatedItem,indexOrKeyOrFunc);
    }
}