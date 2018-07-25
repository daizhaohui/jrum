import crypto from 'crypto';

export default class Crypt {

    static encrypt(key,text){
        var key = new Buffer(key);
        var iv = new Buffer(0);
        var cipher = crypto.createCipheriv('des-ecb', key, iv);
        cipher.setAutoPadding(true)  //default true
        var ciph = cipher.update(text, 'utf8', 'base64');
        ciph += cipher.final('base64');
        return ciph;
    }

    static descrypt(key,text){
        var key = new Buffer(key);
        var iv = new Buffer(0);
        var decipher = crypto.createDecipheriv('des-ecb', key, iv);
        decipher.setAutoPadding(true);
        var txt = decipher.update(text, 'base64', 'utf8');
        txt += decipher.final('utf8');
        return txt;
    }

}