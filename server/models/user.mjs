import {mongoose} from '../database/index.mjs';

const userSchema = new mongoose.Schema({
    name:String,
    password:String,
    chinese_name:String
});
var user = mongoose.model("users",userSchema);

export default user;