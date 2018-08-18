import {Controller,ConnectController} from 'jrum';
import TableList from './tableList';

class TableListController extends Controller{

    addItem() {
        var user = this.Services.Global.get("user");
        alert(user.name);
    }

    propsMap(){
        return {
            propToMethod:{
                "onAddItem":this.addItem
            },
            dataToProp:{
                "table.list":"list",
            }
        }
    }
}

export default  ConnectController(TableListController,TableList);