import log4js from 'log4js';
import path from 'path';

log4js.configure({
    "appenders":[{
      "category":"logger_date",
      "type": "dateFile",
      "filename": path.resolve(process.cwd,"logs/date"),
      "alwaysIncludePattern": true,
      "pattern": "-yyyy-MM-dd.log"
    }],
    "replaceConsole": true,
    "levels":{
        "logger_date":"ERROR"  //由低到高分别为:ALL TRACE DEBUG INFO WARN ERROR FATAL OFF，高于或等于所设置级别的日志打印出来
    }
});
const logger = log4js.getLogger("logger_date");

export default {
    error:(e)=>{logger.error(e)},
    info:(i)=>{logger.info(i)},
    warn:(w)=>{logger.warn(w)},
    trace:(t)=>{logger.trace(t)},
    debug:(d)=>{logger.debug(t)},
    fatal:(f)=>{logger.fatal(f)}
};