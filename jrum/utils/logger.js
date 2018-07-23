var __console__ = window.console || {
        error:function(){},
        info:function(){},
        warn:function () {},
        log:function () {}
    };

export  default  class  Logger {

    static  error(){
        process.env.NODE_ENV==='development' && __console__.error.apply(null,Array.prototype.slice.call(arguments));
    }

    static info() {
        process.env.NODE_ENV==='development' &&  __console__.info.apply(null,Array.prototype.slice.call(arguments));
    }

    static warn() {
        process.env.NODE_ENV==='development' &&  __console__.warn.apply(null,Array.prototype.slice.call(arguments));
    }

    static log() {
        process.env.NODE_ENV==='development' &&  __console__.log.apply(null,Array.prototype.slice.call(arguments));
    }

}