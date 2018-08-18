import React from 'react';
import { Form,Input,Modal} from 'antd';

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
        var data;

        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
                if(menu.isAdd){
                    data = {
                        ...values,
                        parent:menu.parent.id
                     }
                }
                this.props.form.resetFields();
                onOk && onOk(data);
          }
        });
        
    }

    componentWillUpdate(props,state){
        let {menu} = props;
        if(!menu.isAdd){
            this.props.form.setFields({
               ...menu,
               ...{
                   name:menu.label
               }
            })
        }
    }

    handleCancel = ()=>{
        let {onCancel} = this.props;
        onCancel && onCancel();
    }

    render(){
        let {menu,visible} = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title={menu.isAdd?'新增':'修改'}
            visible={visible}
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
                        getFieldDecorator('name', {
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