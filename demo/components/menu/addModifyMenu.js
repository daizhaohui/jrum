import React from 'react';
import { Form,Input } from 'antd';

const FormItem = Form.Item;

export class AddModifyMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible:false
        }
    }

    handleOk = (e)=>{
        let {onOk,menu} = this.props;
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
          if (!err) {
            onOk && onOk({
               ...values
            });
          }
        });
        
    }

    handleCancel = ()=>{
        let {onCancel} = this.props;
        onCancel && onCancel();
    }

    render(){
        let {menu} = this.props;

        return (
            <Modal
            title={menu.isAdd?'新增':'修改'}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <Form onSubmit={this.handleOk}>
                <FormItem
                    label="编码"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}>
                    {
                        getFieldDecorator('id', {
                            rules: [{ required: true, message: '请输入编码!' }],
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    label="名称"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}>
                    {
                        getFieldDecorator('id', {
                            rules: [{ required: true, message: '请输入名称!' }],
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    label="路由地址"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}>
                    {
                        getFieldDecorator('url')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    label="图标"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}>
                    {
                        getFieldDecorator('icon')(
                            <Input />
                        )
                    }
                </FormItem>
            </Form>
            </Modal>
        )
    }
}

const WrappedForm = Form.create()(AddModifyMenu);
export default WrappedForm;