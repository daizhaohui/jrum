import Logger from './logger.mjs';

export default (err,ctx)=>{
    try{
        Logger.error(err);
        if(ctx){
            Logger.error(JSON.stringify(ctx));
        }
    } catch(e){
        console.log(e);
    }
}