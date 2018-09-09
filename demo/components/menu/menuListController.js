import {Controller,ConnectController} from 'jrum';
import MenuList from './menuList';
import {Menu} from '../../model';
import {message} from 'antd';
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

    addMenu(data){
        var http = this.Services.Http;
        http.post("addMenu",data).then(res=>{
            if(res.status===200 && res.data){
                if(res.data.code===1){  
                    Menu.append("list",data,data.parent);
                    message.success('添加菜单成功！');
                } else {
                    message.error('添加菜单失败！');
                }
            }
        })
    }

    deleteMenu(data){
        var http = this.Services.Http;
        http.delete({
                name:"deleteMenu",
                params:{
                    id:data.id
                }
            }).then(res=>{
            if(res.status===200 && res.data){
                if(res.data.code===1){           
                    Menu.delete("list",data.id);
                    message.success('删除菜单成功！');
                } else {
                    message.error('删除菜单失败！');
                }
            }
        });
    }

    updateMenu(data){
        var http = this.Services.Http;
        http.put({
                name:"updateMenu",
                params:{
                    id:data.id
                },data
            }).then(res=>{
            if(res.status===200 && res.data){
                if(res.data.code===1){
                    Menu.update("list",{
                        label:data.label,
                        icon:data.icon,
                        url:data.url
                    },data.id);
                    message.success('修改菜单成功！');
                } else {
                    message.error('删除菜单失败！');
                }
            }
        });
    }

    propsMap(){
        return {
            propToMethod:{
                "getMenus":this.getMenuList,
                "addMenu":this.addMenu,
                "updateMenu":this.updateMenu,
                "deleteMenu":this.deleteMenu
            },
            dataToProp:{
                "menu.list":"list"
            }
        }
    }

}

export default  ConnectController(MenuListController,MenuList);