import {Controller,DataTypes,ConnectController} from 'jrum';
import TableList from './tableList';

class TableListController extends Controller{

    addItem(handler) {
        var user = this.Services.Global.get("user");

        alert(user.name);
    }

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
                defaultValue:[1,2,3],
                prop:"list",
                dataType:DataTypes.Array
            },
            loading:{
                defaultValue:false,
                prop:"loading",
                dataType:DataTypes.Boolean
            }
        }
    }
}

export default  ConnectController(TableListController,TableList);