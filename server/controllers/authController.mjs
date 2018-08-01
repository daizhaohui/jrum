import { parse } from 'url';
import AppConfig from '../app.config.mjs';
import Token from '../helpers/token.mjs';
import ErrorHandler from '../helpers/errorHandler.mjs';
export default class AuthController {

    static async checkUserToken(ctx,next){
        try
        {
            let { pathname } = parse(ctx.request.url);
            let excludePaths = AppConfig.token.checkTokenExcludePath?`,${AppConfig.token.checkTokenExcludePath.join(',')},`:"";
            let token = ctx.headers['token'];
            if(excludePaths && excludePaths.indexOf(`,${pathname},`)>=0){
                return await next();
            }
    
            token = Token.parse(token);
            if(token){
                if((Date.now().getTime()-token.date)/1000>(AppConfig.token.expiredSeconds||1200)){
                    ctx.body =  AppConfig.codeMessage.expired_token;
                } else {
                    await next();
                }
            }
            else {
                ctx.body = AppConfig.codeMessage.invalid_token;
            }
        } catch(e){
            ErrorHandler.handle(e);
        }
        
    }

}