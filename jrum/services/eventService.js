const _events={

};
export default class EventService{
    constructor(){
    }

    on(name,callback){
        if(_events[name]===undefined){
            _events[name] = [];
        }
        _events[name].push(callback);
    }

    off(name,callback){
        var i,
            len,
            item,
            items,
            newItems;

        if(_events[name]!==undefined){
            if(callback===undefined){
                delete _events[name];
            } else {
                newItems = [];
                items = _events[name];
                len = items.length;
                for(i=0;i<len;i++){
                    item = items[i];
                    if(item!==callback) {
                        newItems.push(item);
                    }
                }
                if(newItems.length<=0){
                    delete _events[name];
                } else {
                    _events[name] = newItems; 
                }
            }       
        }
    }

    emit(name,...args){
        var i,
        len,
        item,
        items;
        items = _events[name];
        if(items){
            len = items.length;
            for(i=0;i<len;i++){
                item = items[i];
                if(item){
                    if(args!==undefined){
                        item.apply(null,args);
                    }
                }
            }
        } else {
            //throw new Error(`未订阅名为${name}的事件`)
        }
      
    }

}