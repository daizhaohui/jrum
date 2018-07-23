import Controller from '../react-redux/controller';
import React from 'react';

class Checker {

    isController(instance) {
        if(typeof instance === "object" && instance instanceof Controller){
            return true;
        }
        return false;
    }

    isFunction(fn) {
        return typeof fn === 'function';
    }

    isPlainObject(obj) {
        if (typeof obj !== 'object' || obj === null) return false

        let proto = obj
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto)
        }
        return Object.getPrototypeOf(obj) === proto
    }

    isNumber(num) {
        return typeof num === 'number' && isFinite(num)
    }

    isArray(arr) {
       return Object.prototype.toString.call(arr)  === '[object Array]';
    }

    isString(str){
        return typeof str === 'string';
    }

    isDate(date){
        return Object.prototype.toString.call(date)  === '[object Date]';
    }

    isBoolean(bool){
        return typeof bool === 'boolean';
    }

    isValue(val){
        return this.isNumber(val) || this.isBoolean(val) || this.isString(val);
    }

    isEmptyObject(obj){
        for (var key in obj){
            return false;
        }
        return true;//返回true，为空对象
    }

}

export default  new Checker();