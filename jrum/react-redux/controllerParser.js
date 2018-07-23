import Checker from '../utils/checker';
import DataTypeParser from './dataTypeParser';
import CreateAction from './createAction';

export default  class ControllerParser{

    constructor(controller) {
        this.controller = controller;
        this.stateDefines = controller.state();
        this.mapActionToProps = controller.mapActionToProps();
        this.controllerName = controller.uniqueName();
    }

    check(){
        var key;
        if(process.env.NODE_ENV==='development'){
            /*
         类型检查
         */
            if(Checker.isController(this.controller)===false){
                throw new Error("constructor's parameter expected to be a instance of Controller class");
            }

            if(Checker.isString(this.controllerName)===false) {
                throw new Error(`Controller uniqueName's value is ${this.controllerName}, expected to be string`);
            }

            if(Checker.isPlainObject(this.stateDefines)===false){
                throw new Error(`Controller state's value is ${this.stateDefines},expected to be plain object`);
            }

            if(Checker.isPlainObject(this.mapActionToProps)===false){
                throw new Error(`Controller mapActionToProps's value is ${this.mapActionToProps},expected to be plain object`);
            }
            /*
            设置的状态配置检查
             */
            for(key in this.stateDefines){
                if(this.stateDefines[key]["defaultValue"]===undefined || this.stateDefines[key]["dataType"]===undefined) {
                    throw new Error(`Controller's uniqueName is ${this.controllerName}. Controller's state is ${JSON.stringify( this.stateDefines)}. State item [${key}] must define defaultValue and dataType`);
                }
                if(DataTypeParser.isDataType(this.stateDefines[key]["dataType"])===false){
                    throw new Error(`Controller's uniqueName is ${this.controllerName}. Controller's state is ${JSON.stringify( this.stateDefines)}. State item [${key}]: dataType is invalid. dataType's value must be  any one  of [DataTypes.String,
                    DataTypes.Number,DataTypes.Bool,DataTypes.Object,DataTypes.Array,DataTypes.Date]`);
                }
                //默认值类型检查
                if(new DataTypeParser(this.stateDefines[key]["defaultValue"]).dataType() !== this.stateDefines[key]["dataType"]){
                    throw new Error(`Controller's uniqueName is ${this.controllerName}. Controller's state is ${JSON.stringify( this.stateDefines)}.State item [${key}]: defaultValue's type must be ${this.stateDefines[key]["dataType"]}`);
                }
            }
            for(key in this.mapActionToProps){
                if(Checker.isFunction(this.mapActionToProps[key])===false) {
                    throw new Error(`Controller's uniqueName is ${this.controllerName}.Controller's mapActionToProps: item [${key}] value is ${JSON.stringify(this.mapActionToProps[key])},expected to be function`);
                }
            }
        }

    }

    getMapActionToProps(dispatch){
       var key,
           result = {};

        for(key in this.mapActionToProps){
            result[key] = CreateAction(dispatch,this.controller,{
                controllerName:this.controllerName,
                prop:key,
                func:this.mapActionToProps[key]
            });
        }
        return result;
    }

    getMapStateToProps(state){
        var key,
            item,
            result = {};
        for(key in this.stateDefines){
            item = this.stateDefines[key];
            if(item.prop){
                result[item.prop] = state[this.controllerName] ? (state[this.controllerName][key] === undefined ? item.defaultValue : state[this.controllerName][key]) : item.defaultValue;
            }
        }
        return result;
    }

}