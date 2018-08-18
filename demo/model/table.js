import {Model} from 'jrum';

const DataTypes = Model.DataTypes;
const Table = Model.create("table",{
    list:{
        default:[1,2,3],
        type:DataTypes.Array
    },
    loading:{
        default:false,
        type:DataTypes.Boolean
    }
});

export default Table;