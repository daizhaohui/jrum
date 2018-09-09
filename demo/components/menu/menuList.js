import React,{Component} from 'react';
import {Tree,Button,Table,message,Modal} from 'antd';
import AddModifyMenu from './addModifyMenu'
import {Menu} from '../../model';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
export  default  class  MenuList extends Component {
    constructor(props){
        super(props);
        this.state = {
            addModifyMenuDialogVisible:false,
            isEdit:false,
            currentMenu:null,
            tableSetting:{
                bordered:true,
                expandedRowRender:undefined
            }
        }
    }

    componentDidMount(){
       this.Services.Event.emit("changeBreadcrumb",[{
            title:"系统管理",
            name:""
       },{
            title:"菜单管理",
            name:"menuList"
        }])
       this.getList();
    }

    deleteMenu = (e)=>{
        let {deleteMenu} = this.props;
        if(this.deleteMenuInfo){
            confirm({
                title: '确定删除该菜单吗?',
                content: ' ',
                okType: 'danger',
                okText:'确定',
                cancelText:'取消',
                onOk:()=> {
                    deleteMenu(this.deleteMenuInfo);
                },
                onCancel:()=>{
                  
                },
              });
        }
    }

    getDeleteFunc = (record,index)=>{
        this.deleteMenuInfo = {
            index:index,
            id:record.id
        };
        return this.deleteMenu;
    }

   

    createOperationCell = (text, record, index)=>{
        return (
            <div>
             <Button onClick={this.getDeleteFunc(record,index)}>删除</Button>
             <Button onClick={this.getEditFunc(record,index)}>修改</Button>
            </div>
        );
    }

    getColumns = ()=>{
        var columns = [
            {
                title:'代码',
                dataIndex:'id'       
            },
            {
                title:'名称',
                dataIndex:'label'       
            },
            {
                title:'路由地址',
                dataIndex:'url'       
            },
            {
                title:'图标名',
                dataIndex:'icon'       
            },
            {
                title:'操作',
                render:this.createOperationCell
            }
        ]; 
        return columns;
    }

    getList = ()=>{
        let {getMenus} = this.props;
        getMenus();
    }

    findMenu = (list,key)=>{
        var i,len,item,result;
        len = list.length;
        result = null;
        for(i=0;i<len;i++){
            item = list[i];
            if(item.id===key){
                result = item;
            } else {
                result = this.findMenu(item.children,key);
            }
            if(result){
                break;
            }
        }
        return result;
    }

    handleOnSelectTree = (e)=>{
        let {list} = this.props;
        if(e.length<=0){
            return;
        }
        var menu;
        //根
        if(e[0]==0){
            menu = {
                id:"",
                label:"应用菜单",
                children:[
                    ...list
                ]
            }
        } else {
            menu = this.findMenu(list,e[0]); 
        }
        this.setState({
            currentMenu:menu
        })
    }

    createTreeNodes = (list)=>{
        return list.map(item=>{
            if(item.children && item.children.length>0){
                return (
                    <TreeNode title={item.label} key={item.id}>
                        {
                            this.createTreeNodes(item.children)
                        }
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.label} key={item.id}/>
                );
            }
        });
    }

    addModifyMenuOk= (data)=>{
        let {addMenu,updateMenu} = this.props;
        this.setState({
            addModifyMenuDialogVisible:false
        });
        if(this.state.isEdit){
            updateMenu(data);
        } else {
            addMenu(data);
        }
     
    }

    addModifyMenuCancel = ()=>{
        this.setState({
            addModifyMenuDialogVisible:false
        })
    }

    getEditFunc = (record,index)=>{
        this.editMenu = record;
        return this.updateMenu;
    }

    updateMenu = ()=>{
        this.setState({
            editMenu:this.editMenu,
            addModifyMenuDialogVisible:true,
            isEdit:true
        });
        this.Services.Event.emit("edit-menu",this.editMenu);
    }

    addMenu = ()=>{
        if(this.state.currentMenu){
            this.setState({
                addModifyMenuDialogVisible:true,
                isEdit:false,
                editMenu:this.state.currentMenu
            })
        } else {
            message.info('您还没有选择父菜单！');
        }       
    }

    getRowKey = (record)=>{
        return record["id"];
    }

    getCurrentMenuChildren(){
        var children;
        let {list} = this.props;
        if(this.state.currentMenu){
            children = this.findMenu(list,this.state.currentMenu.id).children;
        }
        return children ? children : [];
    }

    render() {
        var subList = this.getCurrentMenuChildren();
        return (
            <div className="menu-list">
                <AddModifyMenu 
                    visible={this.state.addModifyMenuDialogVisible} 
                    isEdit={this.state.isEdit}
                    menu={this.state.editMenu} 
                    onOk={this.addModifyMenuOk} 
                    onCancel={this.addModifyMenuCancel}
                    Services={this.Services}
                    />
                <div className="menu-tree">
                    <Tree onSelect={this.handleOnSelectTree}>
                        <TreeNode title={'应用菜单'} key={'0'} >
                        {
                            this.createTreeNodes(this.props.list)
                        }
                        </TreeNode>
                    </Tree>
                </div>
                <div className="menu-data">
                    <div>
                        <Button type="primary" onClick={this.addMenu} className="btn">新增</Button>
                    </div>
                    <div>
                        <Table {...this.state.tableSetting} columns={this.getColumns()} dataSource={subList} rowKey={this.getRowKey} bordered={true}/>
                    </div>  
                </div>

                <style jsx="true">{`
                    .menu-list{

                    }
                    .menu-tree{
                        display: inline-block;
                        width:20%;
                        vertical-align:top;
                    }
                    .menu-data{
                        display: inline-block;
                        width:80%;
                    }
                    .menu-data .btn{
                        margin:20px 0 20px 0;
                    }
                `}</style>
            </div>
        )
    }
}