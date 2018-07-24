import Logger from './logger.mjs';

export default (err,ctx)=>{
    try{
        console.log(err);
        Logger.error(err);
        if(ctx){
            console.log(ctx);
            Logger.error(JSON.stringify(ctx));
        }
    } catch(e){
        console.log(e);
    }
}