import {Model} from 'jrum';

const DataTypes = Model.DataTypes;
const Menu = Model.create("menu",{
    "list":{
        type:DataTypes.Array,
        treeOption:{
            key:'id',
            children:'children'
        },
        default:[]
    }
});

export default Menu;

