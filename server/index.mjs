import Koa from 'koa';
import AppConfig from './app.config.mjs';
import {Routes,AllowedMethods} from './routers/index.mjs';
import {AuthController} from './controllers/index.mjs';
import handleError from './helpers/errorHandler.mjs';
import KoaBody from 'koa-body';
import appConfigMjs from './app.config.mjs';

const app = new Koa();
const port = AppConfig.port || 8008;

//错误处理
app.on('error',handleError);
app.use(KoaBody());
//用户会话检查
app.use(AuthController.checkUserToken);
app.use(Routes);
app.use(AllowedMethods);

app.listen(port);
console.log(`server listening port:${port}`);


