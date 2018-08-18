import Checker from '../utils/checker';
import DataTypeParser from '../model/dataTypeParser';
import CreateAction from './createAction';

export default  class ControllerParser{

    constructor(controller) {
        this.controller = controller;
    }

    check(){
        var key,
            map,
            propsMap;

        if(process.env.NODE_ENV==='development'){
            /*
         类型检查
         */
            if(Checker.isController(this.controller)===false){
                throw new Error("constructor's parameter expected to be a instance of Controller class");
            }

            if(Checker.isFunction(this.controller.propsMap)===false) {
                throw new Error(`Controller's propsMap  expected to be function`);
            }

            propsMap = this.controller.propsMap();
            if(Checker.isPlainObject(propsMap)===false){
                throw new Error(`Controller's propsMap return value  expected to be Object`);
            }
            /*
            设置的状态配置检查
             */
            map = propsMap.dataToProp;
            if(map){
                for(key in map){
                    if(key.split('.').length!==2){
                        throw new Error(`Controller's [${JSON.stringify(propsMap)}] propToMethod item [${key}] is expected to be like '*.*'`);
                    }
                }
            }
            
            map = propsMap.propToMethod;
            if(map){
                for(key in map){
                    if(Checker.isFunction(map[key])===false) {
                        throw new Error(`Controller's propToMethod item [${key}] value is expected to be function`);
                    }
                   
                }
            }         
        }

    }

    getMapActionToProps(dispatch){
       var key,
           map,
           result = {};

        map = this.controller.propsMap();
        if(map && map.propToMethod){
            map = map.propToMethod;
            if(map){
                for(key in map){
                    result[key] = CreateAction(dispatch,this.controller,{
                        prop:key,
                        func:map[key]
                    });
                }
            }
        }
        return result;
    }

    getMapStateToProps(state){
        var key,
            prop,
            values,
            map,
            result = {};
        map = this.controller.propsMap();

        if(map && map.dataToProp){
            map = map.dataToProp;
            for(key in map){
                prop = map[key];
                values = key.split('.');
                if(prop){
                    result[prop] = state[values[0]][values[1]];
                }
            }
        }   
        return result;
    }

}