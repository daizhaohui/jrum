import Router from 'koa-router';
import { createContext } from 'vm';

const indexRouter = new Router();

indexRouter.get('/',async (ctx,next)=>{
    ctx.body = "hello,world!";
});


export default indexRouter;