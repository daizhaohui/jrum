import { parse } from 'url';
import AppConfig from '../app.config.mjs';
import Token from '../helpers/token.mjs';
import AppConfig from '../app.config.mjs';


export default class AuthController {

    static checkUserToken(ctx,next){
        let { pathname } = parse(ctx.request.url);
        let excludePaths = `,${AppConfig.token.checkSessionExcludePath.toString()},`;
        let token = ctx.headers['token'];
        if(excludePaths.indexOf(`,${pathname},`)>=0){
            return next();
        }

        token = Token.parse(token);
        if(token){
            if((Date.now().getTime()-token.date)/1000>(AppConfig.token.expiredSeconds||1200)){
                return AppConfig.codeMessage.expired_token;
            } else {
                next();
            }
        }
        else {
            return AppConfig.codeMessage.invalid_token;
        }
    }

}