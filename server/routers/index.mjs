import Router from 'koa-router';
import {UserController} from '../controllers/index.mjs';

const indexRouter = new Router();

indexRouter.get('/',async (ctx,next)=>{
    ctx.body = "hello,world!";
    next();
});

indexRouter.get('/v1/login',UserController.login);

const Routes = indexRouter.routes();
const AllowedMethods = indexRouter.allowedMethods();

export {
    Routes,
    AllowedMethods
} 