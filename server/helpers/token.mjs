import Crypto  from 'crypto';
import AppConfig from '../app.config.mjs';
import Crypt from '../utils/crypt.mjs';

export default class Token{

    static parse(str){
        if(!str){
            return null;
        }
        var obj = null;
        try{
            obj = Crypt.descrypt(AppConfig.token.cryptKey,str);
            obj = JSON.parse(obj);
        }
        catch(e){
            console.log(e);
        }
        return obj;
    }

    static create(obj){
        return Crypt.encrypt(AppConfig.token.cryptKey,JSON.stringify(obj));
    }

}