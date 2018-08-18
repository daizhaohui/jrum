import DataTypes from '../model/dataTypes';

export default  class StateInitializer{

    constructor(modelName,schema) {
        this.schema = schema;
        this.modelName = modelName;
        this.state = {
            [modelName]:{}
        }
    }

    getValue() {
        var name,
            defaultValue,
            dataType;

        for(name in this.schema) {
            dataType = this.schema[name].type;
            if(dataType===DataTypes.Object){
                defaultValue = this.schema[name].default || {};
            } else if(dataType===DataTypes.Array) {
                defaultValue = this.schema[name].default || [];
            } else {
                defaultValue = this.schema[name].default
            }
            this.state[this.modelName][name] = defaultValue;
        }
        return this.state;
    }


}