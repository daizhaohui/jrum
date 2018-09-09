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
        let {onOk,menu,isEdit} = this.props;
        e.preventDefault();
        var data;

        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
                if(isEdit){
                    data = {
                        ...values
                    }
                } else {
                    data = {
                        ...values,
                        parent:menu.id
                    }
                }
               
                this.props.form.resetFields();
                onOk && onOk(data);
          }
        });
        
    }

    componentDidMount(){
        var {Services} = this.props;
        Services.Event.on("edit-menu",(menu)=>{
            this.props.form.setFieldsValue({
                label:menu.label,
                id:menu.id,
                icon:menu.icon,
                url:menu.url
            });
        });
    }

    componentWillMount(){
        var {Services} = this.props;
        Services.Event.off("edit-menu");
    }

    handleCancel = ()=>{
        let {onCancel} = this.props;
        this.props.form.resetFields();
        onCancel && onCancel();
    }

    render(){
        let {visible,isEdit} = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title={!isEdit?'新增':'修改'}
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
                            <Input disabled={isEdit}/>
                        )
                    }
                </FormItem>
                <FormItem
                    label="名称"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}>
                    {
                        getFieldDecorator('label', {
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