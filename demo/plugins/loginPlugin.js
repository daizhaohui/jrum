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

         this.http.post("login",{
            name:userName,
            password:Base64.encode(password)
         }).then((res)=>{
             if(res.status===200){
                if(res.data.status===1){
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

     userSessionIsValid = ()=>{
        var user = JSON.parse(localStorage.getItem('$user$'));
        if(user && user.userName==='admin' && user.password==='admin') {
            return true;
        }
        return false;
     }


     login = (userName,password,callback)=>{
         if(userName!=='admin' && password!=='admin'){
             return callback('无效的用户名和密码');
         }
         localStorage.setItem('$user$',JSON.stringify({
             userName,
             password
         }));
         return callback();
     }

     getAuthorization = (callback)=>{
        return callback([]);
     }

    getMenus = (callback)=>{
        var menus = [
            {
                id:'m1',
                label:'控件',
                url:'',
                icon:'',
                children:[{
                    id:'m1_1',
                    label:'数据查询列表',
                    url:'tableList',
                    icon:'',
                }]
            },
            {
                id:'m2',
                label:'测试2',
                url:'',
                icon:'',
                children:[{
                    id:'m2_1',
                    label:'hello',
                    url:'hello',
                    icon:'',
                }]
            }
        ];
        return callback(menus);
    }

    getBackPassword = ()=>{
        alert('找回密码！');
    }
}