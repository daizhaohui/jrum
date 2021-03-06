import ReducerHelper from '../../jrum/react-redux/reducer/reducerHelper.js';
import MenuData from '../data/menu.js';
import DataTypes from '../../jrum/model/dataTypes.js';

var _state,_stateCollection;

process.env.NODE_ENV==='development';

beforeEach(()=>{
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
})

test("test Reducer:findItemIndexPath:object",()=>{
    var state,result;
    state = _state;
    result = ReducerHelper.findItemIndexPath(state.menu.list,'jsxt',"id","children",true);
    expect(result[0]).toStrictEqual(3);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'djsz',"id","children",true); //1，0，2，0
    console.log(JSON.stringify(result));
    expect(result[0]).toStrictEqual(1);
    expect(result[1]).toStrictEqual(0);
    expect(result[2]).toStrictEqual(1);
    expect(result[3]).toStrictEqual(0);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'jsxt',"id","children",true); //1，0，2，0
    expect(result[0]).toStrictEqual(3);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'js',"id","children",true); //1，0，2，0
    expect(result[0]).toStrictEqual(2);
    expect(result[1]).toStrictEqual(0);
    expect(result[2]).toStrictEqual(2);
});

test("test Reducer:findItemIndexPath:collection",()=>{
    var state,result;
    state = _stateCollection;
    result = ReducerHelper.findItemIndexPath(state.menu.list,'jsxt',"id","children",false);
    expect(result[0]).toStrictEqual(3);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'djsz',"id","children",false); //1，0，2，0
    console.log(JSON.stringify(result));
    expect(result[0]).toStrictEqual(1);
    expect(result[1]).toStrictEqual(0);
    expect(result[2]).toStrictEqual(1);
    expect(result[3]).toStrictEqual(0);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'jsxt',"id","children",false); //1，0，2，0
    expect(result[0]).toStrictEqual(3);
    result = ReducerHelper.findItemIndexPath(state.menu.list,'js',"id","children",false); //1，0，2，0
    expect(result[0]).toStrictEqual(2);
    expect(result[1]).toStrictEqual(0);
    expect(result[2]).toStrictEqual(2);
});

test("test Reducer:check",()=>{
    var state,action;
    action = {
        schema:{
            type:DataTypes.Object,
            treeOption:{
                key:'id',
                children:'children'
            }
        },
        modelName:'menu',
        name:'list'
    }
    state = {
        menu:{
            list:{
                id:0,
                name:0,
                children: [{
                    id:1,
                    name:1,
                    children:[{
                        id:2,
                        name:2,
                        children:[{
                            id:3,
                            name:3,
                            children:[]
                        }]
                    }]
                },{
                    id:4,
                    name:4,
                    children:[]
                }]
            }
        }
    };
   
    ReducerHelper.execute(state,action);

});