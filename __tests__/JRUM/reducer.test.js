import ReducerHelper from '../../jrum/react-redux/reducer/reducerHelper.js';
import MenuData from '../data/menu';
import DataTypes from '../../jrum/model/dataTypes';

var _state;

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


    // _action = {
    //     name:"list",
    //     modelName:"menu",
    //     schema:{
    //         type:DataTypes.Object,
    //         treeOption:{
    //             key:'id',
    //             children:'children'
    //         }
    //     },
    //     parent:'',
    //     payLoad:{
    //         id:'test-1',
    //         name:'测试1',
    //         url:'test1',
    //         icon:'test-icon1',
    //         children:[]
    //     }
    // }
})

test("test Reducer:findItemIndexPath",()=>{

    var state,result;

    state = _state;
    result = ReducerHelper.findItemIndexPath(state.menu.list,'jsxt',"id","children",true);
    expect(result[0]).toStrictEqual(3);
});