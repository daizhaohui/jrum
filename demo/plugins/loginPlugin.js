var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
    
        input = Base64._utf8_encode(input);
    
        while (i < input.length) {
    
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }   
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);   
        }  
        return output;
    },
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
    
        for (var n = 0; n < string.length; n++) {
    
            var c = string.charCodeAt(n);
    
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
    
        }
    
        return utftext;
    }
};
export default  class LoginPlugin {

     verifyUserInfo = (userName,password,callback)=>{
         if(!userName) {
             return callback('请输入用户名！');
         }
         if(!password) {
             return callback('请输入密码！');
         }
         return callback();
     }

     userSessionIsValid = ()=>{
        var token = localStorage.getItem('__token__');
        if(token) {
            return true;
        }
        return false;
     }

     login = (userName,password,callback)=>{
        this.http.post("login",{
            name:userName,
            password:Base64.encode(password)
         }).then((res)=>{
             if(res.status===200){
                if(res.data.status===1){
                    localStorage.setItem('__token__',res.data.token);
                    callback();
                } else {
                    callback(res.data.message); 
                }
             } else {
                callback('网路异常，请稍后重试！')
             }
         }).catch((e)=>{
             console.error(e);
             callback('网路异常，请稍后重试！')
         })
     }

     ///
    //  [{
    //     type:'', //授权类型（权限的分类）
    //     code:'', //授权码,同一个type，code唯一
    //     authority:'' //权利，多个权利以逗号隔开，如'read,write' 有读写的权利
    //  }]
     //
     getAuthorization = (userName,callback)=>{
        this.http.get({
            name:"privilege",
            paras:{
                name:userName
            }
        }).then((res)=>{
             if(res.status===200 && res.data){
                var i,len,item,result;
                len = res.data.length;
                result = [];
                for(i=0;i<len;i++){
                    item = res.data[i];
                    result.push({
                        type:item.resource_type,
                        code:item.resource_id,
                        authority:item.operation
                    });
                }
                console.log(`auth:${JSON.stringify(result)}`)
                callback(result);
             } else {
                callback([])
             }
         }).catch((e)=>{
             console.error(e);
             callback([])
         })
     }

    getMenus = (userName,callback)=>{
        this.http.get({
            name:"userMenus",
            paras:{
                name:userName
            }
        }).then((res)=>{
             if(res.status===200 && res.data){
                callback(res.data.data);
             } else {
                callback([])
             }
         }).catch((e)=>{
             console.error(e);
             callback([])
         })
    }

    getBackPassword = ()=>{
        alert('找回密码！');
    }
}