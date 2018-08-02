import AppConfig from '../app.config.mjs';

export default class RequestHandler {
    
    //https://blog.csdn.net/nsdnresponsibility/article/details/78319096
    //cros，简单请求：必填项Access-Control-Allow-Origin，其它项：Access-Control-Expose-Headers
    //非简单请求:会发送预检请求，必填项Access-Control-Allow-Origin ，Access-Control-Allow-Methods 其它项：Access-Control-Allow-Headers
     static async handle(ctx,next){
        var origin = ctx.header.origin;
        //跨域了(cros)
        if(origin!==ctx.origin && AppConfig.allowOrigins.find(item=>item===origin)){
            //设置简单请求和非简单请求公共的header
            ctx.set("Access-Control-Allow-Origin",origin); //是否允许的域名
            ctx.set("Access-Control-Allow-Credentials", true); //是否允许设置cookie（可选）
            //非简单请求，发送了options预检请求
            if(ctx.method === "OPTIONS"){ 
                ctx.set("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS"); //非简单请求：预检请求允许的方法
                ctx.set("Access-Control-Allow-Headers","x-requested-with, accept, origin, content-type");//非简单请求：设置可以接收到的额外的header字段（可选）
                ctx.set("Access-Control-Max-Age",20*60);//非简单请求：下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证，单位为秒(可选)
                ctx.status = 204;
            } 
            //简单请求
            else {
                //ctx.set("Access-Control-Expose-Headers","") 简单请求：设置拿到除了6个基本header字段值得其他字段    
                await next();      
            }     
        } else {
            await next();  
        }
        
    }

}