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
                    message.success('添加菜单成功！');
                    this.getMenuList(); //刷新菜单
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
                    message.success('删除菜单成功！');
                    Menu.delete("list",data.index)
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
                    message.success('修改菜单成功！');
                    Menu.update("list",{
                        label:data.name,
                        icon:data.icon,
                        url:data.url
                    },(item)=>item.id===data.id)
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