import {Model} from 'jrum';

const DataTypes = Model.DataTypes;
const Menu = Model.create("menu",{
    "list":{
        type:DataTypes.Array,
        default:[]
    },
    "subList":{
        type:DataTypes.Array,
        default:[]
    }
});

export default Menu;

