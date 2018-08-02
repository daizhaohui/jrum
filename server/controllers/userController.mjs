import {ServiceFactory,ServiceNames} from '../services/index.mjs';
import ErrorHandler from '../helpers/errorHandler.mjs';
import Base64 from '../utils/base64.mjs';
import AppConfig from '../app.config.mjs';

const _userService = ServiceFactory.getService(ServiceNames.USER);
export default class UserController{

    static async login(ctx,next){
        var result;
        try{
            result =  await _userService.validUser({
                name:ctx.request.body.name,
                password:Base64.decode(ctx.request.body.password)
            });
            ctx.body = result;  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        }    
    }

    /*获取用户权限
    */
    static async getUserPrivilege(ctx,next){
        var result;
        try{
            result =  await _userService.getUserPrivilege(ctx.params.name);
            ctx.body = result;  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        }    
    }

}