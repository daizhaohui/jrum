import React,{Component} from 'react';
import {Layout,Tree,Button} from 'antd';

const {Header,Footer,Sider,Content} = Layout;

export  default  class  MenuList extends Component {
    constructor(props){
        super(props);
    }

    getList = ()=>{
        let {getMenus} = this.props;
        getMenus();
    }

    render() {
        return (
            <div className="menu-list">
                <div className="menu-tree">
                    
                </div>
                <div className="menu-data">
                    <div>
                        <Button type="primary" onClick={this.getList}>查询</Button>
                    </div>
                    <div>
                        list
                    </div>
                </div>

                <style jsx="true">{`
                    .menu-list{

                    }
                    .menu-tree{
                        display: inline-block;
                        width:30%;
                    }
                    .menu-data{
                        display: inline-block;
                        width:70%;
                    }
                `}</style>
            </div>
        )
    }
}