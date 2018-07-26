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
            password:password
         },{
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            }
         }).then((res)=>{
             console.log("aaa");
             console.log(res);
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