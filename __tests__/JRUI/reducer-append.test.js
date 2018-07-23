import Reducer from '../../jrum/react-redux/reducer';
import {APPEND_DATA,DELETE_DATA,UPDATE_DATA,INSERT_DATA,INIT_DATA} from '../../jrum/react-redux/actionTypes';
import {DataTypes} from '../../jrum';

var state = {
    tableList:{
        list:[],
        obj:{

        }
    }
},arrayAppendAction = {
    type:APPEND_DATA,
    name:"list",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:[],
        dataType:DataTypes.Array
    },
    payLoad:{}
}, objectAppendAction = {
    type:APPEND_DATA,
    name:"obj",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:{},
        dataType:DataTypes.Object
    },
    payLoad:{}
};


beforeEach(() => {

});

afterEach(() => {

});

test("reducer.append:Array",()=>{

    var result;
    arrayAppendAction.payLoad = {
        id:1,
        name:"王二",
        age:100
    }
    result = Reducer(state,arrayAppendAction);

    expect(result[arrayAppendAction.controllerName][arrayAppendAction.name][0].id).toBe(1);
    arrayAppendAction.payLoad = {
        id:2,
        name:"李四",
        age:80
    }
    result = Reducer(result,arrayAppendAction);
    expect(result[arrayAppendAction.controllerName][arrayAppendAction.name][1].age).toBe(80);

    arrayAppendAction.payLoad = [
        {
            id:3,
            name:"李3",
            age:30
        },
        {
            id:4,
            name:"李4",
            age:40
        }
    ];
    result = Reducer(result,arrayAppendAction);
    expect(result[arrayAppendAction.controllerName][arrayAppendAction.name].length).toBe(4);
    expect(result[arrayAppendAction.controllerName][arrayAppendAction.name][3].age).toBe(40);

    console.log(JSON.stringify(result));
});

test("reducer.append:Object",()=>{

    var result;
    objectAppendAction.payLoad ={
        1:{
            id:1,
            name:"王二",
            age:100
        }
    }
    result = Reducer(state,objectAppendAction);

    expect(result[objectAppendAction.controllerName][objectAppendAction.name]["1"].id).toBe(1);
    objectAppendAction.payLoad = {
      2:{
          id:2,
          name:"李四",
          age:80
      },
        3:{
            id:3,
            name:"李四",
            age:60
        }
    }
    result = Reducer(result,objectAppendAction);
    expect(result[objectAppendAction.controllerName][objectAppendAction.name]["3"].age).toBe(60);

    console.log(JSON.stringify(result));
});
