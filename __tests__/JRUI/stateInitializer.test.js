import StateInitializer from '../../jrum/react-redux/stateInitializer';
import {DataTypes} from '../../jrum';

var defines =  {
    list:{
        defaultValue:[1,2],
        prop:"list",
        dataType:DataTypes.Array
    },
    loading:{
        defaultValue:false,
        prop:"loading",
        dataType:DataTypes.Bool
    },
    message:{
        defaultValue:"abc",
        dataType:DataTypes.String
    },
    obj:{
        defaultValue:null,
        dataType:DataTypes.Object
    },
    items:{
        defaultValue:null,
        dataType:DataTypes.Array
    },
    num:{
        defaultValue:1.20,
        dataType:DataTypes.Number
    }
};

test("StateHandler",()=>{
    var initializer,
        state,
        controllerName = "tableList";

    initializer = new StateInitializer(controllerName,defines)
    state = initializer.getValue();
    expect(state[controllerName].list.length).toBe(2);
    expect(state[controllerName].list[0]).toBe(1);
    expect(state[controllerName].loading).toBe(false);
    expect(state[controllerName].message).toBe("abc");
    expect(state[controllerName].obj).not.toBe(null);
    expect(state[controllerName].obj.id).toBe(undefined);
    expect(state[controllerName].items.length).toBe(0);
    expect(state[controllerName].num).toBe(1.20);

});