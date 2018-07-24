import {ServiceFactory,ServiceNames} from '../services/index.mjs';
export default class UserController{

    static async login(ctx,next){
        var userService,
            userInfo,
            userName,
            password;

        userService = ServiceFactory.getService(ServiceNames.USER)
        userInfo = await userService.getUser(userName);
        if(userInfo && password===userInfo.password) {

        } else {

        }
        next();
    }

}