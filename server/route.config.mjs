import {UserController} from './controllers/index.mjs';

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
        }
    ]
}