import AES256 from 'nodejs-aes256';
export default class Crypt {

    static encrypt(key,text){
        return AES256.encrypt(key,text);
    }

    static descrypt(key,text){
        return AES256.decrypt(key,text);
    }
}
