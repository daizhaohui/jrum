import React,{Component} from 'react';
import {Tree,Button,Table} from 'antd';
import AddModifyMenu from './addModifyMenu'

const TreeNode = Tree.TreeNode;

const columns = [
    {
        title:'代码',
        key:'id',
        dataIndex:'id'       
    },
    {
        title:'名称',
        key:'name',
        dataIndex:'name'       
    },
    {
        title:'路由地址',
        key:'url',
        dataIndex:'url'       
    },
    {
        title:'图标名',
        key:'icon',
        dataIndex:'icon'       
    }
    
];
export  default  class  MenuList extends Component {
    constructor(props){
        super(props);
        this.state = {
            subMenus:[],
            addModifyMenuDialogVisible:false,
            editMenu:null,
            currentMenu:null
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
        var menu = this.findMenu(list,e[0]);
        this.setState({
            subMenus:menu.children,
            currentMenu:menu
        })
    }

    createTreeNodes = (list)=>{
        return list.map(item=>{
            if(item.children.length>0){
                return (
                    <TreeNode title={item.label} key={item.id}>
                        {
                            this.createTreeNodes(item.children)
                        }
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.label} key={item.id} isLeaf={true}/>
                );
            }
        });
    }

    addModifyMenuOk= (data)=>{

        this.setState({
            addModifyMenuDialogVisible:false
        })
    }

    addModifyMenuCancel = ()=>{
        this.setState({
            addModifyMenuDialogVisible:false
        })
    }

    addMenu = ()=>{
        this.setState({
            addModifyMenuDialogVisible:true,
            editMenu:{
                isAdd:true,
                parent:this.state.currentMenu
            }
        })
    }

    render() {
        
        return (
            <div className="menu-list">
                <AddModifyMenu 
                    visible={this.state.addModifyMenuDialogVisible} 
                    menu={this.editMenu} 
                    onOk={this.addModifyMenuOk} 
                    onCancel={this.addModifyMenuCancel}
                    Services={this.Services}
                    />
                <div className="menu-tree">
                    <Tree onSelect={this.handleOnSelectTree}>
                        {
                            this.createTreeNodes(this.props.list)
                        }
                    </Tree>
                </div>
                <div className="menu-data">
                    <div>
                        <Button type="primary" onClick={this.addMenu}>新增</Button>
                    </div>
                    <div>
                        <Table columns={columns} dataSource={this.state.subMenus} bordered={true}/>
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
                `}</style>
            </div>
        )
    }
}