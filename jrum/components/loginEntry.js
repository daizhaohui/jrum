import React from 'react';
import HttpService from '../services/httpService';
import axios from 'axios';

export default class LoginEntry extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    toMainPage = (data)=>{
        if(data===undefined){
            throw new Error(`调用toMainPage方法时没有传入任何参数`);
        }
        if(typeof data !=='object'){
            throw new Error(`调用toMainPage方法时没有传入参数应该是数据对象`);
        }

        if(data.menus===undefined) {
            throw new Error(`调用toMainPage方法时传入的参数数据没有定义属性menus`);
        } 
        if(data.authority===undefined) {
            throw new Error(`调用toMainPage方法时传入的参数数据没有定义属性authority`);
        }

        try{
            window.localStorage.setItem("__data__",JSON.stringify(data));
            window.location.href = "index.html";
        }catch(e){
            console.error(e);
        }
       
    }

    render(){
        let {Config} = this.props;
        var http = new HttpService(Config.ApiUrls,axios);
        return (
            <Config.LoginLayout Http={http} toMainPage={this.toMainPage} AppInfo={Config.AppInfo}/>
        )
    }
}