export default  class LoginPlugin {

    /*
    验证用户输入信息,callback()表示验证成功,callback(errMessage)返回验证失败信息
     */
     verifyUserInfo = (userName,password,callback)=>{
         return callback();
     }

     /*
     验证用户会话是否有效，返回true/false
      */
     userSessionIsValid = ()=>{
        return true;
     }

     /*
     登录（调用后台认证接口),callback()表示验证成功,callback(errMessage)返回验证失败信息
     userName:用户名 password:密码.
      */
     login = (userName,password,callback)=>{
         return callback();
     }

     /*
     获取授权信息，通过callback(data)返回，data授权信息格式为：
     [{
        type:'', //授权类型（权限的分类）
        code:'', //授权码,同一个type，code唯一
        authority:'' //权利，多个权利以逗号隔开，如'read,write' 有读写的权利
     }]
      */
     getAuthorization = (callback)=>{

     }

     /*
     获取菜单，以callback(data)返回菜单，菜单数据格式：
     [
        {
            id:'',//菜单唯一标识
            label:'',//菜单显示名称
            url:'',//路由地址,
            children:[{
                id:'',
                label:'',
                url:''
            }]
        }
     ]
      */
     getMenus = (callback)=>{

     }

     /*
     找回密码处理
      */
    getBackPassword = ()=>{

    }

}