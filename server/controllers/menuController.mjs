import {ServiceFactory,ServiceNames} from '../services/index.mjs';
import ErrorHandler from '../helpers/errorHandler.mjs';

const _menuService = ServiceFactory.getService(ServiceNames.MENU);

export default class MenuController {

    static async getUserMenus(ctx,next){
        var result;
        try{
            result =  await _menuService.getUserMenus(ctx.params.name);
            ctx.body = {
                code:1,
                data:result,
                message:''
            };  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        } 
    }

    static async addMenu(ctx,next){
        var result;
        try{
            result =  await _menuService.addMenu(ctx.request.body);
            ctx.body = {
                code:result?1:0,
                message:result?'success':'fail'
            };  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        } 
    }

    static async deleteMenu(ctx,next){
        var result;
        try{
            result =  await _menuService.deleteMenu(ctx.params.id);
            ctx.body = {
                code:result?1:0,
                message:result?'success':'fail'
            };  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        } 
    }

    static async updateMenu(ctx,next) {
        var result;
        try{
            result =  await _menuService.updateMenu(ctx.request.body);
            ctx.body = {
                code:result?1:0,
                message:result?'success':'fail'
            };  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        } 
    }

    static async getMenus(ctx,next) {
        var result;
        try{
            result =  await _menuService.getMenus(ctx.params.name);
            ctx.body = {
                code:1,
                data:result,
                message:''
            };  
        }catch(e){
            ErrorHandler.handle(e);
            ctx.body = ErrorHandler.getResponseOfServerError(e);
        } 
    }
}
