import Reducer from '../../jrum/react-redux/reducer';
import {UPDATE_DATA} from '../../jrum/react-redux/actionTypes';
import {DataTypes} from '../../jrum';

var state = {
    tableList:{
        list:[],
        obj:{

        },
        normal:''
    }
},
normalAction={
    type:UPDATE_DATA,
    name:"normal",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:'',
        dataType:DataTypes.String
    },
    payLoad:"I love you"
},
arrayAction = {
    type:UPDATE_DATA,
    name:"list",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:[],
        dataType:DataTypes.Array
    },
    payLoad:{}
}, objectAction = {
    type:UPDATE_DATA,
    name:"obj",
    controllerName:"tableList",
    stateDefine:{
        defaultValue:{},
        dataType:DataTypes.Object
    },
    payLoad:{}
};

test("reducer update",()=>{

    var result;
    normalAction.payLoad ={
        item: "I hate you!"
    };

    result = Reducer(state,normalAction);
    expect(result[normalAction.controllerName][normalAction.name]).toBe("I hate you!");

    normalAction.payLoad ={
        item: {
            id:1,
            name:"王刚"
        }
    };
    result = Reducer(result,normalAction);
    console.log("reducer update:"+JSON.stringify(result));
    expect(result[normalAction.controllerName][normalAction.name]).toBe("I hate you!");

});

test("reducer update object-1:",()=>{

    var result=state;

    result[objectAction.controllerName][objectAction.name] = {
      2:{
          id:2,
          name:'李四',
          age:30
      },
      3:false,
        4:{
            id:4,
            name:'李四1',
            age:20
        },
        5:{
            id:5,
            name:'李四2',
            age:40
        },
        6:{
            id:6,
            name:'李四3',
            age:60
        },
    };
    objectAction.payLoad ={
        item: {
            id:1,
            name:"王刚"
        }
    };
    result = Reducer(result,objectAction);
    expect(result[objectAction.controllerName][objectAction.name][1]).toBe(undefined);

    objectAction.payLoad ={
        item: {
               id:2,
               name:'王刚'
           },
        key:"2"
    };
    result = Reducer(result,objectAction);
    expect(result[objectAction.controllerName][objectAction.name][2].age).toBe(30);
    expect(result[objectAction.controllerName][objectAction.name][2].name).toBe('王刚');

    objectAction.payLoad ={
        item: true,
        key:"3"
    };
    expect(result[objectAction.controllerName][objectAction.name][3]).toBe(false);
    result = Reducer(result,objectAction);
    expect(result[objectAction.controllerName][objectAction.name][3]).toBe(true);

    objectAction.payLoad ={
        item: {
            sex:1,
            name:'王刚'
        },
        func:(item)=>{return item.age===30 || item.age===40}
    };
    result = Reducer(result,objectAction);
    expect(result[objectAction.controllerName][objectAction.name][2].sex).toBe(1);
    expect(result[objectAction.controllerName][objectAction.name][2].name).toBe('王刚');
    expect(result[objectAction.controllerName][objectAction.name][5].sex).toBe(1);
    expect(result[objectAction.controllerName][objectAction.name][4].sex).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name][6].name).toBe('李四3');

    objectAction.payLoad ={
        item: {},
        key:"6"
    };
    result = Reducer(result,objectAction);
    console.log("reducer update object-1:"+JSON.stringify(result));
    expect(result[objectAction.controllerName][objectAction.name][6].id).toBe(undefined);
    expect(result[objectAction.controllerName][objectAction.name][6].name).toBe(undefined);


});


test("reducer update array-1:",()=>{
    var result=state;
    result[arrayAction.controllerName][arrayAction.name] = [
        {
            id:1,
            name:'李四1',
            age:30
        },
    ];

    arrayAction.payLoad={
      item:{
          id:2,
          name:'李四2',
          age:20
      },
        index:1

    };
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name][0].age).toBe(30);
    expect(result[arrayAction.controllerName][arrayAction.name][1]).toBe(undefined);

    result[arrayAction.controllerName][arrayAction.name].push({
        id:2,
        name:'李四2',
        age:20
    });
    arrayAction.payLoad={
        item:{
            id:2,
            name:'王刚',
            age:30
        },
        index:1
    };
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name][1].age).toBe(30);
    expect(result[arrayAction.controllerName][arrayAction.name][1].name).toBe('王刚');

    result[arrayAction.controllerName][arrayAction.name].push({
        id:3,
        name:'李四3',
        age:20
    });
    arrayAction.payLoad={
        item:{
            id:2,
            name:'王刚3',
            age:60,
            sex:1
        },
        index:1
    };
    result = Reducer(result,arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name][1].age).toBe(60);
    expect(result[arrayAction.controllerName][arrayAction.name][1].name).toBe('王刚3');
    expect(result[arrayAction.controllerName][arrayAction.name][1].sex).toBe(1);


    result[arrayAction.controllerName][arrayAction.name].push({
        id:4,
        name:'李四4',
        age:40
    });
    result[arrayAction.controllerName][arrayAction.name].push({
        id:5,
        name:'李四5',
        age:40
    });
    arrayAction.payLoad={
        item:{
            age:90,
            sex:0
        },
        func:(item)=>{return item.age===40}
    };
    result = Reducer(result,arrayAction);
    console.log("reducer update array-1:"+JSON.stringify(result));
    expect(result[arrayAction.controllerName][arrayAction.name][3].sex).toBe(0);
    expect(result[arrayAction.controllerName][arrayAction.name][4].sex).toBe(0);
    expect(result[arrayAction.controllerName][arrayAction.name][4].age).toBe(90);

});


test("reducer update covered:",()=> {
    var result = state;
    result[arrayAction.controllerName][arrayAction.name] = [
        {
            id: 1,
            name: '李四1',
            age: 30
        },
    ];

    arrayAction.payLoad = {
        covered:true,
        item: [1,2]
    };
    result = Reducer(result, arrayAction);
    expect(result[arrayAction.controllerName][arrayAction.name].length).toBe(2);
    expect(result[arrayAction.controllerName][arrayAction.name][1]).toBe(2);

    objectAction.payLoad = {
        covered:true,
        item:1
    }
    result = Reducer(result, objectAction);
    console.log("reducer update covered:"+JSON.stringify(result));
    expect(result[objectAction.controllerName][objectAction.name]).toBe(1);
});
