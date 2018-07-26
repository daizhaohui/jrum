import {ServiceFactory,ServiceNames} from '../services/index.mjs';
import ErrorHandler from '../helpers/errorHandler.mjs';
export default class UserController{

    static login(ctx,next){
        var userService,
            result;
        try{
            userService = ServiceFactory.getService(ServiceNames.USER)
            result =  userService.validUser({
                name:ctx.request.body.name,
                password:ctx.request.body.password
            });
            ctx.body = result;   
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = {
                status:500,
                message:`服务端错误`
            }
        }    
    }

}