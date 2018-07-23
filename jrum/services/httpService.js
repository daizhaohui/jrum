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
        len = this.apiUrls.length;
        for(i=0;i<len;i++){
            item = this.apiUrls[i];
            this.apiUrls[item.name] = item.url;
        }
    }

    request = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        _mergeConfig(url,config);
        this.http.request(config);
    }

    get = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.get(url,config);
    }

    delete = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.delete(url,config);
    }

    head = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.head(url,config);
    }

    options = (name,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.options(url,config);
    }

    post = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.post(url,data,config);
    }

    put = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.put(url,data,config);
    }

    patch = (name,data,config)=>{
        var url;

        url = _checkName(this.apiUrls,name);
        this.http.patch(url,data,config);
    }

    all =()=>{
        this.http.all.apply(this.http,Array.prototype.slice.call(arguments));
    }

    spread = (callback)=>{
        this.http.spread.apply(this.http,Array.prototype.slice.call(arguments));
    }

    createIntance = (config)=>{
        return this.http.create(config);
    }
}