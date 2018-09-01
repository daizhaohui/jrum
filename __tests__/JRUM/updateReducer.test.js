import UpdateReducer from '../../jrum/react-redux/reducer/updateReducer.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes';

var _state,_action,_reducer,_actionCollection,_stateCollection;

beforeEach(()=>{
    _reducer = new UpdateReducer();

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
        }
    };

});

test("test updateReducer tree update-1:root is Object",()=>{
    var result,value;

    //覆盖更新
    _action.payLoad = {
        covered:true,
        item:{
            id:1,
            name:'na1',
            children:[]
        }
    };
    result = _reducer.execute(_state,_action);
    expect(_state.menu.list.children.length).toStrictEqual(4);
    expect(_state.menu.list.id).toStrictEqual('root');
    expect(result.menu.list.children.length).toStrictEqual(0);
    expect(result.menu.list.id).toStrictEqual(1);

    //指定parent：指定根为父
    _action.payLoad = {
        item:{
            id:'test-1',
            name:'测试1',
            url:'test1',
            icon:'test-icon1',
        }
    };
    _action.parent = 'root';
    _action.payLoad.index = 1;
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[1];
    expect(value.id).toStrictEqual('hy');
    value = result.menu.list.children[1];
    expect(value.id).toStrictEqual('test-1');
    expect(value.children.length).toStrictEqual(2);

    _action.payLoad = {
        item:{
            id:'test-1',
            name:'测试1',
            url:'test1',
            icon:'test-icon1',
            children:[]
        }
    };
    _action.parent = 'root';
    _action.payLoad.index = 1;
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[1];
    expect(value.children.length).toStrictEqual(0);

    //指定parent：指定key
    _action.parent = 'zjqx1';
    _action.payLoad.key = 'yh';
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[2].children[0].children;
    expect(value.length).toStrictEqual(3);
    expect(value[1].id).toStrictEqual('test-1');
});

test("test updateReducer tree update-2:root is Object",()=>{
    var result,value;

    _action.payLoad = {
        item:{
            name:'测试1'
        }
    };

    //没有指定parent，根据key查找
    _action.payLoad.key = 'sjjgz'; //1 0 1 1
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[1].children[0].children[1].children[1];
    expect(value.name).toStrictEqual('测试1');

    //没有指定parent，根据key查找，为根
    _action.payLoad.key = 'root';
    result = _reducer.execute(_state,_action);
    value = result.menu.list;
    expect(value.name).toStrictEqual('测试1');

    _action.payLoad.key = undefined;
    _action.payLoad.func = item=>{
        return item.id==='hydy' || item.id==='sjjgz' || item.id==='jsxt' || item.id==='cxgl';
    };
    result = _reducer.execute(_state,_action);
    value = result.menu.list.children[0].children[0].children[0];
    expect(value.name).toStrictEqual('测试1');
    value = result.menu.list.children[1].children[0];
    expect(value.name).toStrictEqual('测试1');
    value = result.menu.list.children[1].children[0];
    expect(value.name).toStrictEqual('测试1');
    value = result.menu.list.children[1].children[0].children[1].children[1];
    expect(value.name).toStrictEqual('测试1');
    //1011

});

test("test updateReducer tree update:root is Collection",()=>{
    var result,value;

    //覆盖更新
    _actionCollection.payLoad = {
        item:{
            id:'test-1',
            name:'测试1',
            url:'test1'
        }
    };
    _actionCollection.parent = 'zjqx1';
    _actionCollection.payLoad.key = 'yh';
    result = _reducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list[2].children[0].children;
    expect(value.length).toStrictEqual(3);
    expect(value[1].id).toStrictEqual('test-1');

    _actionCollection.parent = undefined;
    _actionCollection.payLoad = {
        item:{
            name:'测试1'
        }
    };

    _actionCollection.payLoad.key = 'sjjgz'; //1 0 1 1
    result = _reducer.execute(_stateCollection,_actionCollection);
    value = result.menu.list[1].children[0].children[1].children[1];
    expect(value.name).toStrictEqual('测试1');

});


test("test updateReducer plat update",()=>{
    var result,value,action,state;
    
    state = {
        menu:{
            list:[1,2,3]
        }
    };
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
    result = _reducer.execute(state,action);
    value = result.menu.list[0];
    expect(value).toStrictEqual(4);

    action.payLoad.index = 4;
    result = _reducer.execute(state,action);
    value = result.menu.list[2];
    expect(value).toStrictEqual(3);

    action.payLoad.index = undefined;
    action.payLoad.func = item=>item<=3;
    result = _reducer.execute(state,action);
    expect(state.menu.list[0]).toStrictEqual(1);
    expect(state.menu.list[1]).toStrictEqual(2);
    expect(state.menu.list[2]).toStrictEqual(3);
    expect(result.menu.list[0]).toStrictEqual(4);
    expect(result.menu.list[1]).toStrictEqual(4);
    expect(result.menu.list[2]).toStrictEqual(4);

    
});