import Koa from 'koa';
import AppConfig from './app.config.mjs';
import IndexRouter from './routers/index.mjs';
import {AuthController} from './controllers/index.mjs';

const app = new Koa();
const port = AppConfig.port || 8008;

//用户会话检查
app.use(AuthController.checkUserSession);
app.use(IndexRouter.routes());
app.use(IndexRouter.allowedMethods());

app.listen(port);
console.log(`server listening port:${port}`);


