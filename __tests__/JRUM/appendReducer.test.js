import AppendReducer from '../../jrum/react-redux/reducer/appendReducer.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes';

var _state,_action,_appendReducer;

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

test("test appendReducer tree append",()=>{
 
    var result,value;

    _action["parent"] = "jsxt";
    result = _appendReducer.execute(_state,_action);
    //console.log(JSON.stringify(result));
    value = result.menu.list.children[3].children[0].id;
    expect(value).toStrictEqual('test-1');

});