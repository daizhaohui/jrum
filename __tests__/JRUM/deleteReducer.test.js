import DeleteReducer from '../../jrum/react-redux/reducer/deleteReducer.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes';

var _state,_action,_reducer,_actionCollection,_stateCollection;

beforeEach(()=>{
    _reducer = new DeleteReducer();

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

test("test deleteReducer tree delete-1:root is Object",()=>{

    var result,value;

    //在指定的父中删除：指定index
    _action.parent = 'djgl';
    _action.payLoad.index = 0;
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);
    value = result.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(1);
    expect(value[0].id).toStrictEqual('sjjgz')

    _action.payLoad.index = -1;
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);
    value = result.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);

    _action.payLoad.index = 1;
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(2);
    value = result.menu.list.children[1].children[0].children[1].children;
    expect(value.length).toStrictEqual(1);
    expect(value[0].id).toStrictEqual('djsz')


    //在指定的父中删除：指定key
    _action.parent = 'root';
    _action.payLoad.key = 'hy';
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children;
    expect(value.length).toStrictEqual(4);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(3);
    expect(value[1].id).toStrictEqual('zjqx')

     //在指定的父中删除：指定func
     _action.parent = 'root';
     _action.payLoad.key = undefined;
     _action.payLoad.index = undefined;
     _action.payLoad.func = (item)=>{
         return item.id==='yx' || item.id==='jsxt';
     }
     result = _reducer.execute(_state,_action);
     value = _state.menu.list.children;
     expect(value.length).toStrictEqual(4);
     value = result.menu.list.children;
     expect(value.length).toStrictEqual(2);
     expect(value[0].id).toStrictEqual('hy');

});


test("test deleteReducer tree delete-2:root is Object",()=>{
     
    var result,value;

    _action.payLoad.key = 'hy';
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children;
    expect(value.length).toStrictEqual(4);
    value = result.menu.list.children;
    expect(value.length).toStrictEqual(3);

    _action.payLoad.key = 'js';
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[2].children[0].children;
    expect(value.length).toStrictEqual(3);
    value = result.menu.list.children[2].children[0].children;
    expect(value.length).toStrictEqual(2);
    expect(value[1].id).toStrictEqual('yh');

    _action.payLoad.key = undefined;
    _action.payLoad.func = (item)=>{
        return item.id==='hy' || item.id==='djgl' || item.id==='js' || item.id==='yh';
    };
    result = _reducer.execute(_state,_action);
    value = _state.menu.list.children[2].children[0].children;
    expect(value.length).toStrictEqual(3);
    expect(_state.menu.list.children.length).toStrictEqual(4);
    value = result.menu.list.children[1].children[0].children;
    expect(value.length).toStrictEqual(1);
    expect(result.menu.list.children.length).toStrictEqual(3);


});

test("test deleteReducer tree delete:root is Collection",()=>{
     var result,value;

     _actionCollection.payLoad.key = undefined;
     _actionCollection.payLoad.func = (item)=>{
        return item.id==='hy' || item.id==='djgl' || item.id==='yh' || item.id==='dx';
    };
    result = _reducer.execute(_stateCollection,_actionCollection);
    value = _stateCollection.menu.list[2].children[0].children;
    expect(value.length).toStrictEqual(3);
    expect(_stateCollection.menu.list.length).toStrictEqual(4);
    value = result.menu.list[1].children[0].children;
    expect(value.length).toStrictEqual(2);
    expect(result.menu.list.length).toStrictEqual(3);
    value = result.menu.list[0].children[0].children;
    expect(value.length).toStrictEqual(3);
    expect(value[2].id).toStrictEqual('yhq');
});

test("test deleteReducer plat delete",()=>{
    var state,action,result;
    
    state = {
        menu:{
            list:[1,2,3,4,5,6]
        }
    };
    action = {
        name:"list",
        modelName:"menu",
        schema:{
            type:DataTypes.Array
        },
        payLoad:{
        }
    };

    action.payLoad.index = 4;
    result = _reducer.execute(state,action);
    expect(state.menu.list.length).toStrictEqual(6);
    expect(result.menu.list.length).toStrictEqual(5);
    expect(result.menu.list[4]).toStrictEqual(6);

    action.payLoad.index = undefined;
    action.payLoad.func = item=> item===1 || item===3;
    result = _reducer.execute(state,action);
    expect(state.menu.list.length).toStrictEqual(6);
    expect(result.menu.list.length).toStrictEqual(4);
    expect(result.menu.list[0]).toStrictEqual(2);
    expect(result.menu.list[2]).toStrictEqual(5);

});