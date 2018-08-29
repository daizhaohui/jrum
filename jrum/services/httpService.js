function _checkName(urls,name){
    var url,pathName;
    if(typeof name === 'string'){
        pathName = name;
        url = urls[name];
    } else if(typeof name === 'object'){
        pathName = name["name"];
        url = urls[pathName];
        for(var param in name.params){
            url = url.replace(`:${param}`,name.params[param])
        }
    } 
    if(!url){
        throw new Error(`名为[${pathName}]的apiUrl不存在！`);
    }
    return url;
}

export  default  class HttpService{
    constructor(apiUrls,http){
        var i,
            len,
            item,
            items;
        items = apiUrls || [];
        this.apiUrls = {};
        this.http = http;
        len = items.length;
        for(i=0;i<len;i++){
            item = items[i];
            this.apiUrls[item.name] = item.url;
        }
    }

    request = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.request(config);
    }

    get = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.get(url,config);
    }

    delete = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.delete(url,config);
    }

    head = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.head(url,config);
    }

    options = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.options(url,config);
    }

    post = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.post(url,data,config);
    }

    put = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.put(url,data,config);
    }

    patch = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        return this.http.patch(url,data,config);
    }

    all =(promises)=>{
      return this.http.all(promises);
    }

    spread = (callback)=>{
        return this.http.spread(callback);
    }

    createIntance = (config)=>{
        return this.http.create(config);
    }
}