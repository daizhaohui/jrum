import ModelManager from './modelManager';
import Model from './model';
import DataTypeParser from './dataTypeParser';
import Checker from '../utils/checker';

const _parseSchema = (schema)=>{
    var parsedSchema,
        key;
    parsedSchema = {};
    for(key in schema){
        if(Checker.isPlainObject(schema[key])){
            parsedSchema[key] = schema[key];
        } else {
            if(process.env.NODE_ENV==='development'){
                if(DataTypeParser.isDataType(parsedSchema[key])===false){
                    throw new Error(`Model Schema:${JSON.stringify(schema)},${parsedSchema[key]} is invalid type,should be one of [${JSON.stringify(DataTypeParser.getDataTypes())}]}`)
                }
            }
            parsedSchema[key] = {
                type:schema[key],
                default:undefined
            }
        }
    }
    return parsedSchema;

}

const create = (name,schema)=>{
    if(ModelManager.isExist(name)){
        throw new Error(`名为${name}的模型已经存在.`)
    }
    var model = new Model(name,schema);
    ModelManager.addModel(name,model);
    ModelManager.addModelSchemal(name,_parseSchema(schema));
    return model;
}
export default create