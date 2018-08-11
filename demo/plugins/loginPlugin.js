import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
    
        input = Base64._utf8_encode(input);
    
        while (i < input.length) {
    
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }   
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);   
        }  
        return output;
    },
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
    
        for (var n = 0; n < string.length; n++) {
    
            var c = string.charCodeAt(n);
    
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
    
        }
    
        return utftext;
    }
};
 class LoginPlugin  extends React.Component{

    constructor(props){
        super(props);
    }

      ///
    //  [{
    //     type:'', //授权类型（权限的分类）
    //     code:'', //授权码,同一个type，code唯一
    //     authority:'' //权利，多个权利以逗号隔开，如'read,write' 有读写的权利
    //  }]
     //
    login = (userName,password)=>{
        let {Http,toMainPage} = this.props;
        var i,len,item,result,data;

        data = {};
        Http.post("login",{
            name:userName,
            password:Base64.encode(password)
            }).then((res)=>{
                if(res.status===200)
                {
                    if(res.data.status===1){
                        localStorage.setItem('__token__',res.data.token);
                        //获取菜单和权限
                        Http.all([Http.get({
                            name:"userMenus",
                            paras:{
                                name:this.userName
                            }
                        }),Http.get({
                            name:"privilege",
                            paras:{
                                name:userName
                            }
                        })]).then(Http.spread((menuRes,authRes)=>{
                            if(menuRes.status===200 && menuRes.data){
                                data["menus"] = menuRes.data;
                            } 
                            if(authRes.status===200 && authRes.data){
                                len = authRes.data.length;
                                result = [];
                                for(i=0;i<len;i++){
                                    item = res.data[i];
                                    result.push({
                                        type:item.resource_type,
                                        code:item.resource_id,
                                        authority:item.operation
                                    });
                                }
                                data["authority"] = result;
                             }
                             if(data.menus && data.authority){
                                toMainPage(data);
                             }
                        })).catch((e)=>{
                            console.error(e);
                        });
                    } 
                }
            }).catch((e)=>{
                console.error(e);
            })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.login(this.state.userName,this.state.password);
          }
        });
    }

    onChangeUserName =(e)=>{
        this.setState({
            userName:e.target.value
        })
    }

    onChangePassword =(e)=>{
        this.setState({
            password:e.target.value
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
        <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
            {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" onChange={this.onChangeUserName}/>
            )}
            </FormItem>
            <FormItem>
            {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
            })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" onChange={this.onChangePassword}/>
            )}
            </FormItem>
            <FormItem>
            {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
            })(
                <Checkbox>Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href="">Forgot password</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
            </Button>
            </FormItem>
        </Form>
        );
    }
 }

 const WrappedLoginForm = Form.create()(LoginPlugin);

 export default WrappedLoginForm;