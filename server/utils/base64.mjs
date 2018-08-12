
import Base64 from 'crypto-js/enc-base64';
import enUTF8 from 'crypto-js/enc-utf8';


const  Base64 = {

    
    encode:(strData)=>{
        var wordArray = enUTF8.parse(strData);
        return Base64.stringify(wordArray);
    },
    decode:(strData)=>{
        var parsedWordArray = Base64.parse(strData);
        return  parsedWordArray.toString(enUTF8);
    }
    
   
};
export default Base64;
