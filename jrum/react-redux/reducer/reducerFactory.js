import Config from './reducerConfig';

const _reducerInstances = {

};

export default class ReducerFactory{

    static create(actionType){
        if(typeof _reducerInstances[actionType]==='undefined'){
            if(Config.reducers[actionType]){
                _reducerInstances[actionType] = new Config.reducers[actionType]();
            }else{
                return null;
            }       
        }
        return _reducerInstances[actionType];
    }

}