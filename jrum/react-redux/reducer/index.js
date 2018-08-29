import ReducerFactory from './reducerFactory';

export default function Reducer(state={},action) {
    var reducer;

    reducer = ReducerFactory.create(action.type);
    if(reducer){
        return reducer.execute(state,action);
    } else {
        return state;
    }
}

