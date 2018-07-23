import Reducer from '../../jrum/react-redux/reducer';
import {INIT_DATA} from '../../jrum/react-redux/actionTypes';

var state = {
    tableList:{
        list:[1,2,3],
        obj:{
            1:{
                id:1,
                name:'李刚'
            }
        }
    },
    test:{

    }
},action = {
    type:INIT_DATA,
    controllerName:"tableList",
    payLoad:{}
};


test("reducer init",()=>{

    var result=state;

    action.payLoad={
        tableList:{
            list:[],
            obj:{}
        }
    };
    action.target={
        initialized:false
    };
    result = Reducer(result,action);
    console.log("reducer insert:"+JSON.stringify(result));
    expect(result[action.controllerName].list.length).toBe(0);
    expect(result[action.controllerName].obj["1"]).toBe(undefined);

});