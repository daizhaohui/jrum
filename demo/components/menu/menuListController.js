import {Controller,DataTypes,ConnectController} from 'jrum';
import MenuList from './menuList';

class MenuListController extends Controller{

    addItem(handler) {

    }

    getMenuList(handler){
        var http = this.Services.Http;
        var app = this.Services.App;
        http.get("menus").then(res=>{
            if(res.status===200 && res.data){
                handler.update("list",res.data.data);
            } else {
                //app.notification.error()
            }
        }).catch(err=>{
        });
    }

    uniqueName(){
        return "demo.menuList";
    }

    mapActionToProps() {
        return {
           "getMenus":this.getMenuList
        }
    }

    state(){
        return {
            list:{
                defaultValue:[],
                prop:"list",
                dataType:DataTypes.Array
            }
        }
    }
}

export default  ConnectController(MenuListController,MenuList);