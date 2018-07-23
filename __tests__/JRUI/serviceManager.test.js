import ServiceManager from '../../jrum/services/serviceManager';


test("service init",()=>{

    process.env.NODE_ENV='development';

    var router = {
        push(){
            return true;
        }
    };
    var dateUtil = {
        getDate(){
            return Date.now().getTime();
        }
    }


    var appConfig = {
        Services:[
            {
                name:'router',
                instance:router
            },
            {
                name:'router',
                instance:router
            },{
                name:'dateUtil',
                instance:dateUtil
            }
        ]
    }
    expect(()=>{ServiceManager.init(appConfig);}).toThrowError(/has been occupied by system service/);
    var Services = ServiceManager.getAllServices();
    //Services.router = dateUtil;
    expect(Services.router.push()).toBe(true);

});