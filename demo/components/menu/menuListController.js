import {Controller,DataTypes,ConnectController} from 'jrum';
import MenuList from './menuList';

class MenuListController extends Controller{

    addItem(handler) {

    }

    getMenuList(handler){
        var http = this.services.http;
        var app = this.services.app;
        app.showLoading();
        http.get("menus").then(res=>{
            if(res.status===200 && res.data){

            } else {
                //app.notification.error()
            }
            app.hideLoading();
        }).catch(err=>{
            app.hideLoading();
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