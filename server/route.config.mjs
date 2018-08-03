import {UserController,MenuController} from './controllers/index.mjs';

export default {

    routes:[
        {
            method:'post',
            path:'/v1/login',
            handler:UserController.login
        },
        {
            method:'get',
            path:'/v1/privilege/:name',
            handler:UserController.getUserPrivilege
        },
        {
            method:'get',
            path:'/v1/menus/:name',
            handler:MenuController.getUserMenus
        },
        {
            method:'get',
            path:'/v1/menus',
            handler:MenuController.getMenus
        },
        {
            method:'post',
            path:'/v1/menu/add',
            handler:MenuController.addMenu
        },
        {
            method:'delete',
            path:'/v1/menu/delete/:id',
            handler:MenuController.deleteMenu
        },
        {
            method:'put',
            path:'/v1/menu/update',
            handler:MenuController.updateMenu
        }
    ]
}