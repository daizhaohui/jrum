import {Menu} from '../models/index.mjs';
import _ from 'lodash';

const _createTree = (data,pid)=>{
    var list = [],
        newItem;
    _.each(data,(item)=>{
        if(item.parent===pid){
            newItem = {
                id:item.id,
                label:item.label,
                icon:item.icon,
                url:item.url
            };
            newItem.children = _createTree(data,item.id)
            list.push(newItem);
        }
    });
    return list;
}

export default class MenuService{

    async getUserMenus(userName){
        var result;
        result = await Menu.find().exec();
        result = _createTree(result,"");
        return result;
    }

    async addMenu(menu){

    }

    async deleteMenu(id){

    }

    async updateMenu(menu) {

    }

    async getMenus(condition) {
  
    }

}