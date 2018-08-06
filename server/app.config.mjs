export default {
    port:8008,
    mode:'debug',
    mongodb:{
        host:'localhost',
        port:27017,
        db_name:'jrum_demo'
    },
    token:{
        checkTokenExcludePath:["/v1/login"],
        cryptKey:"abcde",
        expiredSeconds:7200
    },
    codeMessage:{
        invalid_token:{code:5001,message:'无效token'},
        expired_token:{code:5002,message:'token失效'},
        server_error:{code:500,message:'服务端错误'}
    },
    allowOrigins:["http://localhost:8000"]    

}