export default {
    port:8008,
    mongodb:{
        host:'localhost',
        port:27017,
        db_name:'jrum_demo'
    },
    token:{
        checkTokenExcludePath:["/login"],
        cryptKey:"abcde",
        expiredSeconds:30
    },
    codeMessage:{
        invalid_token:{code:5001,message:'无效token'},
        expired_token:{code:5002,message:'token失效'}
    }
    

}