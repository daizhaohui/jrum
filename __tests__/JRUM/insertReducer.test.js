import InsertReducer from '../../jrum/react-redux/reducer/insertReducer.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes';

var _state,_action,_reducer,_actionCollection,_stateCollection;

beforeEach(()=>{
    _reducer = new InsertReducer();

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
        payLoad:{
            item:{
                id:'test-1',
                name:'测试1',
                url:'test1',
                icon:'test-icon1',
                children:[]
            }
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
        payLoad:{
            item:{
                id:'test-1',
                name:'测试1',
                url:'test1',
                icon:'test-icon1',
                children:[]
            }
        }
    };

});

test("test insertReducer tree insert-1:root is Object",()=>{

    var result,value;

    //中间位置插入
    _action.payLoad.key  = "hy";
    _action.isInsertBefore = false;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[2].id).toStrictEqual('test-1');

    _action.isInsertBefore = true;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[1].id).toStrictEqual('test-1');

    //找不到插入，保持数据变
    _action.payLoad.key = undefined;
    _action.payLoad.index = 0;
    _action.isInsertBefore = false;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(4); 

    //集合起始位置插入
    _action.payLoad.index = undefined;
    _action.payLoad.func = (item)=>{
        return item.id === 'yx';
    };
    _action.isInsertBefore = false;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[1].id).toStrictEqual('test-1');

    _action.isInsertBefore = true;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[0].id).toStrictEqual('test-1');

    //集合末尾位置插入
    _action.payLoad.index = undefined;
    _action.payLoad.key = 'jsxt';
    _action.isInsertBefore = false;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[4].id).toStrictEqual('test-1');

    _action.isInsertBefore = true;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(5);
    expect(value[3].id).toStrictEqual('test-1');

    //在指定key的位置插入
    _action.payLoad.key = "djsz";
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[1].children[0].children[1];
    expect(value.children.length).toStrictEqual(3);
    expect(value.children[0].id).toStrictEqual('test-1');

});

test("test insertReducer tree insert-2:root is Object",()=>{
    var result,value,state;

    //一次插入多条记录
    _action.payLoad.item = [
        {
            id:'test-2',
            name:'测试3',
            url:'test3',
            icon:'test-icon3',
            children:[]
        },{
            id:'test-3',
            name:'测试3',
            url:'test3',
            icon:'test-icon3',
            children:[]
        }
    ];

    //指定的key为根对象
    _action.payLoad.key = "root";
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(6);
    expect(value[4].id).toStrictEqual('test-2');
    expect(value[5].id).toStrictEqual('test-3');

    _action.payLoad.key = undefined;
    //在指定的父的指定位置插入:指定index
    _action.parent = "zsgl"; //0,0,1
    _action.payLoad.index = -1;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(0);

    _action.payLoad.index = 0;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);
    expect(value[0].id).toStrictEqual('test-2');
    expect(value[1].id).toStrictEqual('test-3');

    _action.payLoad.item = [
        {
            id:'test-4',
            name:'测试4',
            url:'test4',
            icon:'test-icon4',
            children:[]
        }
    ];
    _action.payLoad.index = 1;
    _action.isInsertBefore = true;
    state = result;
    result = _reducer.execute(state,_action);
    value = state.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);
    value = result.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(3);
    expect(value[1].name).toStrictEqual('测试4');
    expect(value[1].children.length).toStrictEqual(0);

    //在指定的父的指定位置插入:指定key
    _action.payLoad.index = undefined;
    _action.payLoad.key = 'test-4';
    _action.isInsertBefore = false;
    _action.payLoad.item = [
        {
            id:'test-5',
            name:'测试5',
            url:'test5',
            icon:'test-icon5',
            children:[]
        }
    ];
    state = result;
    result = _reducer.execute(state,_action);
    value = result.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(4);
    expect(value[2].id).toStrictEqual('test-5');
    expect(value[2].name).toStrictEqual('测试5');
    expect(value[2].icon).toStrictEqual('test-icon5');

    //在指定的父的指定位置插入:指定func
    _action.payLoad.index = undefined;
    _action.payLoad.key = undefined;
    _action.payLoad.func = (item)=>{
        return item.name.indexOf('测试5')>=0
    };
    _action.isInsertBefore = false;
    _action.payLoad.item = [
        {
            id:'test-6',
            name:'测试6',
            children:[]
        }
    ];
    state = result;
    result = _reducer.execute(state,_action);
    value = result.menu.list.children[0].children[0].children[1].children;
    expect(value.length).toStrictEqual(5);
    expect(value[3].id).toStrictEqual('test-6');
    expect(value[3].name).toStrictEqual('测试6');
    expect(value[3].url).toStrictEqual(undefined);

});

test("test insertReducer tree insert:root is collection",()=>{

 var result,value;

    //中间位置插入
    _actionCollection.payLoad.key  = "hy";
    _actionCollection.isInsertBefore = false;
    result = _reducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list;
    expect(value.length).toStrictEqual(5);
    expect(value[2].id).toStrictEqual('test-1');

    _actionCollection.isInsertBefore = true;
    result = _reducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list;
    expect(value.length).toStrictEqual(5);
    expect(value[1].id).toStrictEqual('test-1');

});

test("test insertReducer plat insert",()=>{
    var state,action,result,value;

    state = {
        menu:{
            list:[1,2,3]
        }
    }

    action = {
        name:"list",
        modelName:"menu",
        schema:{
            type:DataTypes.Array,
        },
        payLoad:{
            item:4
        }
    };

    action.payLoad.index = 0;
    action.isInsertBefore = true;
    result = _reducer.execute(state,action);
    value = result.menu.list;
    expect(value.length).toStrictEqual(4);
    expect(value[0]).toStrictEqual(4);

    action.payLoad = {
        item:[
        {
            id:1,
            name:'na1'
        },
        {
            id:2,
            name:'na2'
        }]
    };
    action.payLoad.index = undefined;
    action.payLoad.func = (item)=>{
        return item === 2;
    };
    action.isInsertBefore = true;
    result = _reducer.execute(state,action);
    value = result.menu.list;
    expect(value.length).toStrictEqual(5);
    expect(value[1].id).toStrictEqual(1);
    expect(value[2].name).toStrictEqual('na2');

});