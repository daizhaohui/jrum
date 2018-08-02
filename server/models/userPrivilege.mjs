import {mongoose} from '../database/index.mjs';

const UserPrivilegeSchema = new mongoose.Schema({
    name:String,
    resource_type:String,
    resource_id:String,
    operation:String
});
const UserPrivilege = mongoose.model("user_privileges",UserPrivilegeSchema);
export default  UserPrivilege;