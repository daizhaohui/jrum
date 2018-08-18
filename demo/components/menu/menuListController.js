import {Controller,ConnectController} from 'jrum';
import MenuList from './menuList';
import {Menu} from '../../model';
class MenuListController extends Controller{

    addItem() {

    }
    
    getMenuList(){
        var http = this.Services.Http;
        http.get("menus").then(res=>{
            if(res.status===200 && res.data){
                Menu.update("list",res.data.data);
            } else {
                //app.notification.error()
            }
        }).catch(err=>{
        });
    }

    propsMap(){
        return {
            propToMethod:{
                "getMenus":this.getMenuList
            },
            dataToProp:{
                "menu.list":"list"
            }
        }
    }

}

export default  ConnectController(MenuListController,MenuList);