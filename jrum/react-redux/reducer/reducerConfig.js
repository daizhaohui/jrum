import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA,INIT_DATA} from '../actionTypes';
import AppendReducer from './appendReducer';
import DeleteReducer from './deleteReducer';
import UpdateReducer from './updateReducer';
import InsertReducer from './insertReducer';
import InitReducer from './initReducer';

export default {
    reducers:{
        [APPEND_DATA]:AppendReducer,
        [DELETE_DATA]:DeleteReducer,
        [UPDATE_DATA]:UpdateReducer,
        [INSERT_DATA]:InsertReducer,
        [INIT_DATA]:InitReducer
    }

}