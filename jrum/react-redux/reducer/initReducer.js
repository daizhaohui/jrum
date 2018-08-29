import ReducerHelper from './reducerHelper';
export default class InitReducer{
    constructor(){
    }

    execute(state,action){
        var result = {
            ...state,
            ...(action.payLoad)
        };
        return result;       
    }
}