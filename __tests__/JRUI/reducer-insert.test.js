import Reducer from '../../jrum/react-redux/reducer';
import {INSERT_DATA} from '../../jrum/react-redux/actionTypes';
import {DataTypes} from '../../jrum';


var state = {
    tableList:{
        list:[],
        obj:{

        }
    }
},arrayAction = {
    type:INSERT_DATA,
    name:"list",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:[],
        dataType:DataTypes.Array
    },
    payLoad:{}
}, objectAction = {
    type:INSERT_DATA,
    name:"obj",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:{},
        dataType:DataTypes.Object
    },
    payLoad:{}
};

test("reducer insert",()=>{

    var result = state;

    arrayAction.payLoad = {
        item:1,
        index:0
    }

    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(1);
    expect(result[arrayAction.controllerName][arrayAction.name][0]).toBe(1);

    arrayAction.payLoad = {
        item:[2,3,4],
        index:0
    }
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(4);
    expect(result[arrayAction.controllerName][arrayAction.name][0]).not.toBe(1);

    arrayAction.payLoad = {
        item:[5],
        index:1
    }
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(5);
    expect(result[arrayAction.controllerName][arrayAction.name][1]).toBe(5);


    arrayAction.payLoad = {
        item:{
            id:6,
            name:'李刚',
            age:10
        },
        index:2
    }
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(6);
    expect(result[arrayAction.controllerName][arrayAction.name][2].name).toBe('李刚');

    arrayAction.payLoad = {
        item:{
            id:8,
            name:'李刚',
            age:10
        },
        index:6
    }
    result = Reducer(result,arrayAction);
    console.log("reducer insert:"+JSON.stringify(result));

    arrayAction.payLoad = {
        item:[4,5,6,7,8],
        func:(item)=>{return item.age===10}
    }
    result = Reducer(result,arrayAction);
    console.log("reducer insert:"+JSON.stringify(result));
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(12);
    expect(result[arrayAction.controllerName][arrayAction.name][3]).toBe(4);
    expect(result[arrayAction.controllerName][arrayAction.name][4]).toBe(5);
    expect(result[arrayAction.controllerName][arrayAction.name][5]).toBe(6);




});