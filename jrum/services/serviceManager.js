
const CacheServices = {

};


export default  class ServiceManager{


    static registerService(item){
        Object.defineProperty(CacheServices,item.name,{
            value:item.instance,
            configurable:false,
            writable:false,
            enumerable:true
        })
    }

    static init(appConfig){

        if(appConfig){
            appConfig.Services.forEach((item)=>{
                if(process.env.NODE_ENV==='development'){
                    if(CacheServices[item.name]){
                        throw  new Error(`service name [${item.name}] has been occupied by system service,you can rename new.`);
                    }
                    ServiceManager.registerService(item);
                }
            });
        }
    }

    static getService(name){
        return CacheServices[name];
    }

    static getAllServices() {
        return CacheServices;
    }

}