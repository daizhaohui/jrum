export  default  class  HttpPlugin {

    requestInterceptor = (config)=>{
        return config;
    }

    responseInterceptor = (response)=>{
        return response; 
    }

    setHttpDefaultSetting = (http)=>{
        
    }


}