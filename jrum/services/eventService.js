export default class EventService{
    constructor(){
        this.events = {

        };
    }

    on(name,callback){
        if(this.events[name]===undefined){
            this.events[name] = [];
        }
        this.events[name].push(callback);
    }

    off(name,callback){
        var i,
            len,
            item,
            items,
            newItems;

        if(this.events[name]!==undefined){
            if(callback===undefined){
                delete this.events[name];
            } else {
                newItems = [];
                items = this.events[name];
                len = items.length;
                for(i=0;i<len;i++){
                    item = items[i];
                    if(item!==callback) {
                        newItems.push(item);
                    }
                }
                if(newItems.length<=0){
                    delete this.events[name];
                } else {
                    this.events[name] = newItems; 
                }
            }       
        }
    }

    emit(name,...args){
        var i,
        len,
        item,
        items;
        items = this.events[name];
        len = items.length;
        for(i=0;i<len;i++){
            item = items[i];
            if(item){
                if(args!==undefined){
                    item.apply(null,args);
                }
            }
        }
    }

}