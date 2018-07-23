import Logger from '../utils/logger';

export  default  class RouteService{

    constructor(routes,history) {
        var i,
            item,
            len;

        this.history = history;
        this.routes = routes || [];
        this.routeCache = {};
        len = this.routes.length;
        for(i=0;i<len;i++){
            item = this.routes[i];
            this.routeCache[item.name] = item.path;
        }
    }

    push = (name,params)=>{
        return this.history.push(this.getPath(name,params));
    }

    // replace =(name,params)=>{
    //     return this.history.replace(this.getPath(name,params),{name});
    // }

    go = (n)=>{
        this.history.go(n);
    }

    goBack = ()=>{
        this.history.goBack();
    }

    goForward = ()=>{
        this.history.goForward()
    }


    getPath = (name,params)=>{
        var path,
            pName;

        path = this.routeCache[name];
        if(!path) {
            return Logger.error(`路由配置中不存在名为${name}的路由！`)
        }

        if(params) {
            for(pName in params) {
                path = path.replace(':'+pName,params[pName]);
            }
        }
        return path;
    }


}