import StateHandler from '../../jrum/react-redux/stateHandler';
import {Controller,DataTypes} from '../../jrum';
import {APPEND_DATA, DELETE_DATA, INSERT_DATA, UPDATE_DATA,} from '../../jrum/react-redux/actionTypes';


class TableListController extends Controller{

    uniqueName(){
        return "demo.tableList";
    }

    mapActionToProps() {
        return {
            "onAddItem":this.addItem
        }
    }

    state(){
        return {
            list:{
                defaultValue:[],
                prop:"list",
                dataType:DataTypes.Array
            },
            loading:{
                defaultValue:false,
                prop:"loading",
                dataType:DataTypes.Bool
            }
        }
    }
}


const state = {};
const controller = new TableListController();
controller.init = function(){
    console.log("controller init")
};


test("StateHandler:setStateByAppend",()=>{
    const mockDispatch = jest.fn();
    const handler = new StateHandler(mockDispatch,state,controller);
    handler.setStateByAppend("list",1);
    expect(mockDispatch.mock.calls[0][0].type).toBe(APPEND_DATA);
    expect(mockDispatch.mock.calls[0][0].controllerName).toBe(controller.uniqueName());
    expect(mockDispatch.mock.calls[0][0].name).toBe("list");
    expect(mockDispatch.mock.calls[0][0].payLoad).toBe(1);
});

test("StateHandler:setStateByDelete",()=>{
    const mockDispatch = jest.fn();
    const handler = new StateHandler(mockDispatch,state,controller);
    handler.setStateByDelete("list",2);
    expect(mockDispatch.mock.calls[0][0].type).toBe(DELETE_DATA);
    expect(mockDispatch.mock.calls[0][0].controllerName).toBe(controller.uniqueName());
    expect(mockDispatch.mock.calls[0][0].name).toBe("list");
    expect(mockDispatch.mock.calls[0][0].payLoad.index).toBe(2);

    handler.setStateByDelete("list",'key1');
    expect(mockDispatch.mock.calls[1][0].payLoad.key).toBe('key1');

    handler.setStateByDelete("list",(item)=>{return false;});
    expect(mockDispatch.mock.calls[2][0].payLoad.func).not.toBe(undefined);
    expect(mockDispatch.mock.calls[2][0].payLoad.key).toBeUndefined();
    expect(mockDispatch.mock.calls[2][0].payLoad.index).toBeUndefined();
});

test("StateHandler:setStateByUpdate",()=>{

    const mockDispatch = jest.fn();
    const handler = new StateHandler(mockDispatch,state,controller);
    handler.setStateByUpdate("list",2,2);
    expect(mockDispatch.mock.calls[0][0].type).toBe(UPDATE_DATA);
    expect(mockDispatch.mock.calls[0][0].controllerName).toBe(controller.uniqueName());
    expect(mockDispatch.mock.calls[0][0].name).toBe("list");
    expect(mockDispatch.mock.calls[0][0].payLoad.index).toBe(2);

    handler.setStateByUpdate("list",[1,2],'key1');
    expect(mockDispatch.mock.calls[1][0].payLoad.key).toBe('key1');
    expect(mockDispatch.mock.calls[1][0].payLoad.item[0]).toBe(1);


    handler.setStateByUpdate("list",2,(item)=>{return false;});
    expect(mockDispatch.mock.calls[2][0].payLoad.func).not.toBe(undefined);
    expect(mockDispatch.mock.calls[2][0].payLoad.key).toBeUndefined();
    expect(mockDispatch.mock.calls[2][0].payLoad.item).toBe(2);
    expect(mockDispatch.mock.calls[2][0].payLoad.index).toBeUndefined();

    handler.setStateByUpdate("list",[1,2]);
    expect(mockDispatch.mock.calls[3][0].payLoad.covered).toBe(true);
    expect(mockDispatch.mock.calls[3][0].payLoad.key).toBeUndefined();

});

test("StateHandler:setStateByInsert",()=>{

    const mockDispatch = jest.fn();
    const handler = new StateHandler(mockDispatch,state,controller);
    handler.setStateByInsert("list",2,2);
    expect(mockDispatch.mock.calls[0][0].type).toBe(INSERT_DATA);
    expect(mockDispatch.mock.calls[0][0].controllerName).toBe(controller.uniqueName());
    expect(mockDispatch.mock.calls[0][0].name).toBe("list");
    expect(mockDispatch.mock.calls[0][0].payLoad.index).toBe(2);

    handler.setStateByInsert("list",[1,2],'key1');
    expect(mockDispatch.mock.calls[1][0].payLoad.key).toBe('key1');

    handler.setStateByInsert("list",[1,2],(item)=>{return false;});
    expect(mockDispatch.mock.calls[2][0].payLoad.func).not.toBe(undefined);
    expect(mockDispatch.mock.calls[2][0].payLoad.key).toBe(undefined);
    expect(mockDispatch.mock.calls[2][0].payLoad.index).toBe(undefined);

});