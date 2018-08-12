import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import enUTF8 from 'crypto-js/enc-utf8';

export default class CryptoService{

    constructor(){
        
    }

    AES = {
        encrypt:(strData,key)=>{
            ciphertext = AES.encrypt(strData, key);
            return ciphertext.toString();
        },
        decrypt:(strData,key)=>{
            var bytes  = AES.decrypt(strData, key);
            return bytes.toString(enUTF8);
        }
    }

    Base64 = {
        encode:(strData)=>{
            var wordArray = enUTF8.parse(strData);
            return Base64.stringify(wordArray);
        },
        decode:(strData)=>{
            var parsedWordArray = Base64.parse(strData);
            return  parsedWordArray.toString(enUTF8);
        }
    }



}