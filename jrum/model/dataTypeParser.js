import DataTypes from './dataTypes';
import Checker from '../utils/checker';

export default  class DataTypeParser {

    constructor(instance){
        this.instance =  instance;
    }

    static getDataTypes(){
        return [DataTypes.String,
            DataTypes.Number,DataTypes.Bool,DataTypes.Object,DataTypes.Array,DataTypes.Date];
    }

    dataType() {
        if(Checker.isArray(this.instance)){
            return DataTypes.Array;
        }
        else if(Checker.isPlainObject(this.instance)){
            return DataTypes.Object;
        }
        else if(Checker.isString(this.instance)){
            return DataTypes.String;
        }
        else if(Checker.isNumber(this.instance)){
            return DataTypes.Number;
        }
        else if(Checker.isBoolean(this.instance)){
            return DataTypes.Boolean;
        }
        else if(Checker.isDate(this.instance)){
            return DataTypes.Date;
        }
        else {
            return undefined;
        }
    }

    static  isDataType(type){
        return type===DataTypes.String || type===DataTypes.Boolean || type===DataTypes.Array || type===DataTypes.Object || type===DataTypes.Number || type===DataTypes.Date
    }

}