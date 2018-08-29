import ModelManager from './modelManager';
import Model from './model';
import DataTypeParser from './dataTypeParser';
import Checker from '../utils/checker';

const _checkSchema = (name,key,schema)=>{
    if(process.env.NODE_ENV==='development'){
        if(!schema.hasOwnProperty('type')){
            throw new Error(`模型【${name}】属性【${key}】没有定义type类型`)
        }
        if(DataTypeParser.isDataType(schema["type"])===false){
            throw new Error(`模型【${name}】属性【${key}】类型无效,值必须为【${JSON.stringify(DataTypeParser.getDataTypes())}】中的一种`)
        }
    }
}

const _parseSchema = (name,schema)=>{
    var parsedSchema,
        key;
    parsedSchema = {};
    for(key in schema){
        if(Checker.isPlainObject(schema[key])){
            parsedSchema[key] = schema[key];
        } else {
            parsedSchema[key] = {
                type:schema[key],
                default:undefined
            }
        }
        _checkSchema(name,key,parsedSchema[key]);
    }
    return parsedSchema;

}

const create = (name,schema)=>{
    if(ModelManager.isExist(name)){
        throw new Error(`名为${name}的模型已经存在.`)
    }
    var model = new Model(name,schema);
    ModelManager.addModel(name,model);
    ModelManager.addModelSchemal(name,_parseSchema(name,schema));
    return model;
}
export default create