import React from 'react';
import HttpService from '../services/httpService';
import CryptoService from '../services/cryptoService';
import axios from 'axios';
import ServiceNames from '../services/serviceNames';

export default class LoginEntry extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    componentWillMount(){
        let {Config} = this.props; 
        if(Config.HttpPlugin){
            this.httpPlugin = new Config.HttpPlugin();
            if(this.httpPlugin.requestInterceptor){
                axios.interceptors.request.use(this.httpPlugin.requestInterceptor);
            }
            if(this.httpPlugin.responseInterceptor){
                axios.interceptors.response.use(this.httpPlugin.responseInterceptor);
            }
            if(this.httpPlugin.setHttpDefaultSetting){
                this.httpPlugin.setHttpDefaultSetting(axios);
            }
        }
        this.Services = {
            [ServiceNames.HTTP]:new HttpService(Config.ApiUrls,axios),
            [ServiceNames.CRYPTO]:new CryptoService()
        }
    }

    toMainPage = (data)=>{
        var cryptedData;

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
            cryptedData = this.Services[ServiceNames.CRYPTO].AES.encrypt(JSON.stringify(data),"jrumdata");
            window.localStorage.setItem("__data__",cryptedData);
            window.location.href = "index.html";
        }catch(e){
            console.error(e);
        }
       
    }

    render(){
        let {Config} = this.props;
        return (
            <Config.LoginLayout Services={this.Services} toMainPage={this.toMainPage} AppInfo={Config.AppInfo}/>
        )
    }
}