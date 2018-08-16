import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './plugin.less';
const FormItem = Form.Item;
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
    getMenus(){
        let {Services} = this.props;
        return Services.Http.get({
            name:"userMenus",
            paras:{
                name:userName
            }
        });
    }

    getAuthority() {
        let {Services} = this.props;
        return Services.Http.get({
            name:"privilege",
            paras:{
                name:userName
            }
        });
    }

    login = (userName,password)=>{
        let {Services,toMainPage} = this.props;
        var i,len,item,result,data;
        data = {};
        Services.Http.post("login",{
            name:userName,
            password:Services.Crypto.Base64.encode(password)
            }).then((res)=>{
                if(res.status===200)
                {
                    if(res.data.status===1){
                        localStorage.setItem('__token__',res.data.token);
                        //获取菜单和权限
                        Services.Http.all([this.getMenus(),this.getAuthority()]).then(Services.Http.spread((menuRes,authRes)=>{
                            if(menuRes.status===200 && menuRes.data){
                                data["menus"] = menuRes.data.data;
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
            <div className="login-wrapper">
                <div className="login-form">
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
                            <div className="login-form-forgot">
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住</Checkbox>
                            )}
                            <a href="">忘记密码</a>
                            </div>
                            <div className="login-form-button">
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
        </div>
        );
    }
 }

 const WrappedLoginForm = Form.create()(LoginPlugin);

 export default WrappedLoginForm;