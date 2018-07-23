import Reducer from '../../jrum/react-redux/reducer';
import {DELETE_DATA} from '../../jrum/react-redux/actionTypes';
import {DataTypes} from '../../jrum';

var state = {
    tableList:{
        list:[],
        obj:{

        }
    }
},arrayAction = {
    type:DELETE_DATA,
    name:"list",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:[],
        dataType:DataTypes.Array
    },
    payLoad:{}
}, objectAction = {
    type:DELETE_DATA,
    name:"obj",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:{},
        dataType:DataTypes.Object
    },
    payLoad:{}
};


test("reducer delete array-1",()=>{

    var result,list;
    arrayAction.payLoad = {
       index:1
    }
    result = Reducer(state,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(0);

    list = result[arrayAction.controllerName][arrayAction.name];
    list.push(1);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(1);
    arrayAction.payLoad = {
        index:1
    }
    result = Reducer(state,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(1);
    arrayAction.payLoad = {
        index:0
    }
    result = Reducer(state,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(0);

    list = result[arrayAction.controllerName][arrayAction.name];
    list.push({
        id:1,
        name:'李四'
    });
    list.push({
        id:2,
        name:'王刚'
    });
    arrayAction.payLoad = {
        index:1
    }
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(1);
    expect(result[arrayAction.controllerName][arrayAction.name][0].name).toBe('李四');

    list = result[arrayAction.controllerName][arrayAction.name];
    list.push({
        id:3,
        name:'四名'
    });
    list.push({
        id:4,
        name:'三毛'
    });
    arrayAction.payLoad = {
        index:1
    }
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(2);
    expect(result[arrayAction.controllerName][arrayAction.name][1].name).toBe('三毛');
    console.log("reducer delete array-1:"+JSON.stringify(result));
});

test("reducer delete array-2",()=>{
    var result,list;

    arrayAction.payLoad = {
        func:(item)=>{
            return item.age === 30 || item.age ===40;
        }

    }
    list = [];
    list.push({
        id:1,
        name:'李四',
        age:20
    });
    list.push({
        id:2,
        name:'王刚1',
        age:30
    });
    list.push({
        id:3,
        name:'王刚2',
    });
    list.push({
        id:4,
        name:'王刚3',
        age:40
    });
    list.push({
        id:5,
        name:'王刚4',
        age:30
    });
    state[arrayAction.controllerName][arrayAction.name] = list;
    result = Reducer(state,arrayAction);
    console.log("reducer delete array-2:"+JSON.stringify(result));
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(2);
    expect(result[arrayAction.controllerName][arrayAction.name][1].name).toBe('王刚2');
});

test("reducer delete object-1",()=>{
    var result,list;

    result = state;
    objectAction.payLoad = {
       key:"1"
    };
    result[objectAction.controllerName][objectAction.name] = {};
    result = Reducer(result,objectAction);

    result[objectAction.controllerName][objectAction.name] = {
        1:{
            name:'小李',
            age:30
        },
        2:{
            name:'小王',
            age:40
        }
    };
    result = Reducer(result,objectAction);
    console.log("reducer delete object-1:"+JSON.stringify(result));
    expect(result[objectAction.controllerName][objectAction.name]["1"]).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name]["2"].age).toBe(40);

});

test("reducer delete object-2",()=>{

    var result,list;

    result = state;
    objectAction.payLoad = {
        func:(item)=>{
            return item.age===30 || item.age===40;
        }
    };
    result[objectAction.controllerName][objectAction.name] = {};
    result = Reducer(result,objectAction);

    result[objectAction.controllerName][objectAction.name] = {
        1:{
            name:'小李',
            age:30
        },
        2:{
            name:'小王',
            age:40
        },
        3:{
            name:'小王1',
            age:40
        },
        4:{
            name:'小王5',
            age:10
        }
    };
    result = Reducer(result,objectAction);
    console.log("reducer delete object-2:"+JSON.stringify(result));
    expect(result[objectAction.controllerName][objectAction.name]["1"]).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name]["2"]).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name]["3"]).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name]["4"].age).toBe(10);

});