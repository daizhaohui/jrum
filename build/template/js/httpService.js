function _checkName(urls,name){
    var url = urls[name];
    if(!url){
        throw new Error(`名为[${name}]的api url不存在！`);
    }
    return url;
}

function _mergeConfig(url,config){
    config.url = url;
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
        _mergeConfig(url,config);
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
        this.http.patch(url,data,config);
    }

    all =()=>{
        return this.http.all.apply(this.http,Array.prototype.slice.call(arguments));
    }

    spread = ()=>{
        return this.http.spread.apply(this.http,Array.prototype.slice.call(arguments));
    }

    createIntance = (config)=>{
        return this.http.create(config);
    }
}