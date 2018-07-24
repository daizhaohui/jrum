import {mongoose} from '../database/index.mjs';

const userSchema = new mongoose.Schema({
    name:String,
    password:String,
    chinese_name:String
});

export default userSchema;