import {ServiceFactory,ServiceNames} from '../services/index.mjs';
import ErrorHandler from '../helpers/errorHandler.mjs';
export default class UserController{

    static async login(ctx,next){
        var userService,
            result;
        try{
            userService = ServiceFactory.getService(ServiceNames.USER)
            result =  await userService.validUser({
                name:ctx.request.body.name,
                password:ctx.request.body.password
            });
            ctx.type = 'application/json; charset=utf-8';
            ctx.body = JSON.stringify(result);  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = {
                status:500,
                message:`服务端错误`
            }
        }    
    }

}