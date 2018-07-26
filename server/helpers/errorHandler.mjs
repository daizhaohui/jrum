import Logger from './logger.mjs';

export default class ErrorHandler{
    static handle(err,ctx){
        try{
            console.error(err);
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
}
