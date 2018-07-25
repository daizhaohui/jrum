import {ServiceFactory,ServiceNames} from '../services/index.mjs';
import Logger from '../helpers/logger.mjs';
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
            Logger.error(e);
            ctx.body = {
                status:500,
                message:`服务端错误`
            }
        }    
    }

}