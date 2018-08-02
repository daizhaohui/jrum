import Logger from './logger.mjs';
import AppConfig from '../app.config.mjs'

export default class ErrorHandler{
    static handle(err,ctx){
        try{
            if(AppConfig.mode==='debug'){
                console.error(err);
            }
            if(err.stack){
                Logger.error(`${err.message}\r\n${err.stack}`);
            } else {
                Logger.error(`${err.message}`);
            }
            if(ctx && ctx.body){
                Logger.error(`${ctx.body}`);
            }
        }catch(err){
            console.error(err);
        }
    }

    static getResponseOfServerError(err){
        return AppConfig.codeMessage.server_error;
    }
}
