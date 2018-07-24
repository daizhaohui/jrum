import Koa from 'koa';
import AppConfig from './app.config.mjs';
import {Routes,AllowedMethods} from './routers/index.mjs';
import {AuthController} from './controllers/index.mjs';
import handleError from './helpers/errorHandler.mjs';

const app = new Koa();
const port = AppConfig.port || 8008;

//设置加密keys
app.keys = AppConfig.keys;
//错误处理
app.on('error',handleError);
//用户会话检查
app.use(AuthController.checkUserSession);
app.use(Routes);
app.use(AllowedMethods);

app.listen(port);
console.log(`server listening port:${port}`);


