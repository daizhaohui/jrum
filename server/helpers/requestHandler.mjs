import AppConfig from '../app.config.mjs';

export default class RequestHandler {

     static async handle(ctx,next){
        if(ctx.method === "OPTIONS"){
            if(AppConfig.allowOrigins.find(item=>item===ctx.header.origin)){  
                ctx.set("Access-Control-Allow-Origin",ctx.header.origin);
                //ctx.set("Access-Control-Allow-Credentials", true);
                ctx.set("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
                ctx.set("Access-Control-Allow-Headers","x-requested-with, accept, origin, content-type");
                ctx.status = 204;
            }
        } else {  
           await next()
        }
    }

}