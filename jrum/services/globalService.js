import Logger from '../utils/logger';
import Checker from '../utils/checker';

export default  class  GlobalService{

    constructor(logger){
        this.values = {};
        this.logger= logger;
    }

    get(name){
        var keys,
            i,
            len,
            key,
            obj;

        keys = name.split('.');
        len = keys.length;
        obj = this.values;
        if(len===1) {
            key = keys[0];
            if(obj.hasOwnProperty(key)) {
                return obj[key];
            } else {
                this.logger.warn(`全局变量服务[global]无名称为${name}的变量！`);
            }
        } else{
            for(i=0;i<len-1;i++){
                key = keys[i];
                if(obj.hasOwnProperty(key)){
                    if(!Checker.isPlainObject(obj[key])){
                        throw new Error(`全局变量服务[global]中,名称为${keys.slice(0,i+1).join('.')}的变量不是对象,无法设置属性${keys[i+1]}的值`);
                    }
                    obj = obj[key];
                } else{
                    this.logger.warn(`全局变量服务[global]无名称为${keys.slice(0,i+1).join('.')}的变量！`);
                    return undefined;
                }
            }
            return obj[keys[len-1]];
        }
    }

    set(name,value){
        var keys,
            i,
            len,
            key,
            obj;

        keys = name.split('.');
        len = keys.length;
        obj = this.values;
        if(len===1) {
            obj[keys[0]] = value;
        } else if(len>1){
            for(i=0;i<len-1;i++){
                key = keys[i];
                if(!obj.hasOwnProperty(key)){
                    obj[key] = {};
                } else {
                    if(!Checker.isPlainObject(obj[key])){
                        throw new Error(`全局变量服务[global]中,名称为${keys.slice(0,i+1).join('.')}的变量不是对象,无法设置属性${keys[i+1]}的值`);
                    }
                }
                obj = obj[key];
            }
            obj[keys[len-1]] = value;
        }
    }

    log(name){
        if(name){
            this.logger.info(JSON.stringify(this.get(name)));
        } else {
            this.logger.info(JSON.stringify(this.values));
        }
    }

}