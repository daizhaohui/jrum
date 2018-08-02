import Router from 'koa-router';
import RouteConfig from '../route.config.mjs';

const indexRouter = new Router();

indexRouter.get('/',async (ctx,next)=>{
    ctx.body = "hello,world!";
    next();
});

RouteConfig.routes.forEach(item=>{
    if(item.method==='post'){
        indexRouter.post(item.path,item.handler);
    }
    else if(item.method==='get'){
        indexRouter.get(item.path,item.handler);
    }
    else if(item.method==='put'){
        indexRouter.put(item.path,item.handler);
    }
    else if(item.method==='delete'){
        indexRouter.del(item.path,item.handler);
    }
})

const Routes = indexRouter.routes();
const AllowedMethods = indexRouter.allowedMethods();

export {
    Routes,
    AllowedMethods
} 