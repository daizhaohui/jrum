import AppendReducer from '../../jrum/react-redux/reducer/appendReducer.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes';

var _state,_action,_appendReducer,_actionCollection,_stateCollection;

beforeEach(()=>{
    _appendReducer = new AppendReducer();

    _state = {
        menu:{
            list:{
                id:'root',
                name:'菜单',
                children:MenuData
            }
        },
        other:{
            a:1,
            b:2
        }
    };

    _stateCollection = {
        menu:{
            list:MenuData
        }
    };

    _actionCollection = {
        name:"list",
        modelName:"menu",
        schema:{
            type:DataTypes.Array,
            treeOption:{
                key:'id',
                children:'children'
            }
        },
        parent:'',
        payLoad:{
            id:'test-1',
            name:'测试1',
            url:'test1',
            icon:'test-icon1',
            children:[]
        }
    };

    _action = {
        name:"list",
        modelName:"menu",
        schema:{
            type:DataTypes.Object,
            treeOption:{
                key:'id',
                children:'children'
            }
        },
        parent:'',
        payLoad:{
            id:'test-1',
            name:'测试1',
            url:'test1',
            icon:'test-icon1',
            children:[]
        }
    };

});

test("test appendReducer tree append:root is Object",()=>{
 
    var result,value;

    _action["parent"] = "jsxt";
    result = _appendReducer.execute(_state,_action);
    value = result.menu.list.children[3].children[0].id;
    expect(value).toStrictEqual('test-1');

    _action["parent"] = "tfsh";
    _action.payLoad.id = 'test-2';
    result = _appendReducer.execute(_state,_action);
    value = result.menu.list.children[0].children[1].children[1].children[0].id;
    expect(value).toStrictEqual('test-2');

    _action["parent"] = "root";
    _action.payLoad = [
        {
            id:'test-3',
            name:'测试3',
            url:'test1',
            icon:'test-icon1',
            children:[]
        },
        {
            id:'test-4',
            name:'测试4',
            url:'test1',
            icon:'test-icon1',
            children:[]
        }
    ]
    result = _appendReducer.execute(_state,_action);
    value = result.menu.list.children.length;
    expect(value).toStrictEqual(6);
    value = result.menu.list.children[4].id;
    expect(value).toStrictEqual('test-3');


    _action["parent"] = undefined;
    _action.payLoad = {
        id:'test-5',
        name:'测试5',
        url:'test5',
        icon:'test-icon5',
        children:[]
    };
    result = _appendReducer.execute(_state,_action);
    value = result.menu.list.children.length;
    expect(value).toStrictEqual(5);
    value = result.menu.list.children[4].id;
    expect(value).toStrictEqual('test-5');

});

test("test appendReducer tree append:root is Collection",()=>{
    var result,value;

    _actionCollection["parent"] = "jsxt";
    result = _appendReducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list[3].children[0].id;
    expect(value).toStrictEqual('test-1');

    _actionCollection["parent"] = "tfsh";
    _actionCollection.payLoad.id = 'test-2';
    result = _appendReducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list[0].children[1].children[1].children[0].id;
    expect(value).toStrictEqual('test-2');

    _actionCollection["parent"] = "root";
    _actionCollection.payLoad = [
        {
            id:'test-3',
            name:'测试3',
            url:'test1',
            icon:'test-icon1',
            children:[]
        },
        {
            id:'test-4',
            name:'测试4',
            url:'test1',
            icon:'test-icon1',
            children:[]
        }
    ]
    result = _appendReducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list.length;
    expect(value).toStrictEqual(4);

    _actionCollection["parent"] = undefined;
    _actionCollection.payLoad = {
        id:'test-5',
        name:'测试5',
        url:'test5',
        icon:'test-icon5',
        children:[]
    };
    result = _appendReducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list.length;
    expect(value).toStrictEqual(5);
    value = result.menu.list[4].id;
    expect(value).toStrictEqual('test-5');
});

test("test appendReducer flat append",()=>{
    var state,
        action,
        result;

    action =  {
        name:"list",
        modelName:"menu",
        schema:{
            type:DataTypes.Array,
        },
        payLoad:4
    }
    state = {
        menu:{
            list:[1,2,3]
        }
    };

    result = _appendReducer.execute(state,action);
    expect(result.menu.list.length).toStrictEqual(4);
    expect(result.menu.list[3]).toStrictEqual(4);

    action.payLoad = [4,5,6];
    result = _appendReducer.execute(state,action);
    expect(result.menu.list.length).toStrictEqual(6);
    expect(result.menu.list[5]).toStrictEqual(6);

});