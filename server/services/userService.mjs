import {User,UserPrivilege} from '../models/index.mjs';
import Token from '../helpers/token.mjs';
export default class UserService{
    constructor(){

    }

    getUser(name) {
        return User.findOne({name:name}).exec();
    }

    getPrivilege(condition){
        return UserPrivilege.find(condition).exec();
    }

    async getUserPrivilege(userName) {
        var result;
        result = await this.getPrivilege({name:userName});
        return result;
    }

    async validUser(user) {
        var result;
        result =  await this.getUser(user.name);
        if(result && result.password && result.password===user.password){
            result = {
                status:1,
                token:Token.create({
                    name:user.name,
                    date:Date.now()
                }),
                message:'OK'
            }
        } else {
            result ={
                status:0,
                token:null,
                message:'无效的用户名和密码'
            }
        }
        return result;
    }

}