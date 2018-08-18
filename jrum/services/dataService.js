import StateHandler from '../react-redux/stateHandler'


export default class DataService{
    constructor(){
        super();
    }

    getHandler(controllerName){
        return StateHandler.getHandler(controllerName);
    }
}