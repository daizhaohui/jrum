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
        var result;
            
        result = await Menu.create({
            id:menu.id,
            label:menu.name,
            icon:menu.icon?menu.icon:'',
            url:menu.url?menu.url:'',
            parent:menu.parent?menu.parent:''
        });
        return result;
    }

    async deleteMenu(id){
        var result;

        result = await Menu.findOneAndDelete({
            id:id,
        });
        return result;
    }

    async updateMenu(menu) {
        var result;
            
        result = await Menu.update(
            {
                id:menu.id
            },
            {
                label:menu.name,
                icon:menu.icon?menu.icon:'',
                url:menu.url?menu.url:'',
            }
        );
        return result;
    }

    async getMenus(condition) {
        var result;
        result = await Menu.find().exec();
        result = _createTree(result,"");
        return result;
    }

}