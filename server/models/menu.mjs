import {mongoose} from '../database/index.mjs';

const MenuSchema = new mongoose.Schema({
    id:String,
    label:String,
    url:String,
    icon:String,
    parent:String
});
const Menu = mongoose.model("menus",MenuSchema);
export default  Menu;