import Checker from '../utils/checker';

export  default  class AuthService {

    /*
    authData:[{
            type:'', //授权类型（权限的分类）
            code:'', //授权码,同一个type，code唯一
            authority:'' //权利，多个权利以逗号隔开，如'read,write' 有读写的权利，或其他0，1,2表示方式
        }]
    */
    constructor(authData) {
        var i,
            len,
            item,
            key;
        this.authData = authData || [];
        this.authCache = {};
        //初始化建立数据
        len = this.authData.length;
        for(i=0;i<len;i++){
            item = this.authData[i];
            key = `${item.type}-${item.code}`;
            if(this.authCache.hasOwnProperty(key)) {
                this.authCache[key] = this.authCache[key] + item.authority+',';
            } else {
                this.authCache[key] = ','+item.authority+',';
            }
        }
    }

    /*
    根据授权类型、授权代码获取其权限，返回权限数组[1,2]
     */
    getAuthority = (type,code)=>{
        var item = this.authCache[`${type}-${code}`];
        return item ? item.slice(1,-1).split(',') : [];
    }

    /*
    指定的type，code和权限，判断是否具备
     */
    hasAuthority = (type,code,authority)=>{
        var item = this.authCache[`${type}-${code}`];
        return item ? item.indexOf(`,${authority},`)>=0 : false;
    }

    /*
    具备指定的所有权限
     */
    hasAndAuthority = (type,code,authority)=>{
        var i,
            len;
        len = authority.length;
        for(i=0;i<len;i++) {
            if(this.hasAuthority(type,code,authority[i])===false) {
                return false;
            }
        }
        return true;
    }

    /*
    具备指定的所有权限的一种
     */
    hasOrAuthority = (type,code,authority)=>{
        var i,
            len;
        len = authority.length;
        for(i=0;i<len;i++) {
            if(this.hasAuthority(type,code,authority[i])===true) {
                return true;
            }
        }
        return false;
    }


}