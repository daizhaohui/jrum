import DataTypes from './dataTypes';

export default  class StateInitializer{

    constructor(controllerName,defines) {
        this.defines = defines;
        this.controllerName = controllerName;
        this.state = {
            [controllerName]:{}
        }
    }

    getValue() {
        var name,
            defaultValue,
            dataType;

        for(name in this.defines) {
            dataType = this.defines[name].dataType;
            if(dataType===DataTypes.Object){
                defaultValue = this.defines[name].defaultValue || {};
            } else if(dataType===DataTypes.Array) {
                defaultValue = this.defines[name].defaultValue || [];
            } else {
                defaultValue = this.defines[name].defaultValue
            }
            this.state[this.controllerName][name] = defaultValue;
        }
        return this.state;
    }


}