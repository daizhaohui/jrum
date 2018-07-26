import  LoginPlugin  from '{{login_plugin_component}}';
import  HttpPlugin from '{{http_plugin_component}}';
import  HttpService from '{{http_service_component}}';

var _httpPlugin = new HttpPlugin();
if(_httpPlugin.setHttpDefaultSetting && typeof _httpPlugin.setHttpDefaultSetting ==='function'){
    _httpPlugin.setHttpDefaultSetting(axios);
}
if(_httpPlugin.requestInterceptor && typeof _httpPlugin.requestInterceptor ==='function'){
    axios.interceptors.request.use(_httpPlugin.requestInterceptor);
}
if(_httpPlugin.responseInterceptor && typeof _httpPlugin.responseInterceptor ==='function'){
    axios.interceptors.response.use(_httpPlugin.responseInterceptor);
}

window.__login__ = new LoginPlugin();
Object.defineProperty(window.__login__,"http",{
    writable:false,
    configurable:false,
    enumerable:true,
    value:new HttpService(JSON.parse('{{{apiUrls}}}'),axios)
});

$(window.document).ready(function(){

    var _login = window.__login__;

    $('#loginButton').on('click',function(){

        var verfiyUserInfo = _login.verifyUserInfo || function(userName,password,callback){
           return callback();
        };
        verfiyUserInfo($('#userName').val(),$('#password').val(),function(message){
            if(message){
                $('#errPassword').html(message);
            } else {
                if(!_login.login){
                    alert('登录插件还没有实现login方法！');
                    return;
                }
                _login.login($('#userName').val(),$('#password').val(),function(message){
                    if(message){
                        $('#errPassword').html(message);
                    } else {
                        window.location.href = "index.html";
                    }
                })
            }
        });
    });

    $('#forgetPassWord').on('click',function(){
        _login.getBackPassword &&  _login.getBackPassword();
    });

});