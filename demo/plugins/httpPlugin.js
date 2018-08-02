export  default  class  HttpPlugin {

    requestInterceptor = (config)=>{
        //添加header
        var token = localStorage.getItem("__token__");
        if(token!==undefined){
            config.headers["token"] = token;
        }
        return config;
    }

    responseInterceptor = (response)=>{
        //token过期或无效,跳转到登录页
        if(response && response.data && (response.data.code===5001||response.data.code===5002)){
            window.location.href = "login.html"
            return;
        }
        return response; 
    }

    setHttpDefaultSetting = (http)=>{
        http.defaults.withCredentials = true;
    }


}