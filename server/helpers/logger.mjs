import log4js from 'log4js';
import Path from 'path';


log4js.configure({
    appenders: {
        dateFile: {
          type: 'dateFile',
          filename:  Path.join(process.cwd(),'/logs/date.log'),
          pattern: 'yyyy-MM-dd'
        }
      },
      categories: {
        default: { appenders: ['dateFile'], level: 'error' } //由低到高分别为:ALL TRACE DEBUG INFO WARN ERROR FATAL OFF，高于或等于所设置级别的日志打印出来
      }
});
const logger = log4js.getLogger("dateFile");

export default {
    error:(e)=>{
      logger.error(e);
    },
    info:(i)=>{logger.info(i)},
    warn:(w)=>{logger.warn(w)},
    trace:(t)=>{logger.trace(t)},
    debug:(d)=>{logger.debug(t)},
    fatal:(f)=>{logger.fatal(f)}
};