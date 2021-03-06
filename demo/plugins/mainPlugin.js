import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import _ from 'lodash';

export default class MainLayout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            routes:[],
            currentLeftMenu:null
        }
        this.menus = {

        }
        this.menuData = [];
    }

    findMenuItem(data,id){
        var item,
            i,
            len,
            findedItem;

        if(this.menus[id]){
            return this.menus[id];
        } else {
            len = data.length;
            for(i=0;i<len;i++){
                item = data[i];
                if(item.id===id){
                    findedItem = item;
                    break;
                } else {
                    findedItem = this.findMenuItem(item.children,id)
                }
            }
        }
        if(findedItem){
            this.menus[id] = findedItem;
            return findedItem;
        }
        return null;
    }

    parseMenuData(menus){
        // {
        //     id:item.id,
        //     label:item.label,
        //     icon:item.icon,
        //     url:item.url
        // }
        this.menuData = menus;
        _.forEach(menus,(item)=>{
            this.menus[item.id] = item;
        })
    }

    /*
    *改变路由
    */
    changeRoute(name,paras){
        let {ChangeRoute} = this.props;
        if(ChangeRoute){
            ChangeRoute(name,paras);
        }
    }

    componentDidMount(){
        let {Services} = this.props;
        Services.Event.on("changeBreadcrumb",(data)=>{
            this.setState({
                routes:data
            })
        });
        this.setState({
            currentLeftMenu:this.menuData.length>0 ? this.menuData[0]:null
        })
    }

    componentWillUnmount(){
        let {Services} = this.props;
        Services.Event.off("changeBreadcrumb");
    }

    componentWillMount(){ 
        let {Menus} = this.props;
        this.parseMenuData(Menus);
    }

    itemRender = (route, params, routes, paths)=>{
        return !route.name ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
    }

    handleMenuClick = (e)=>{
        var menuItem = this.findMenuItem(this.menuData,e.key);
        var curMenuKey = this.state.currentLeftMenu?this.state.currentLeftMenu.id:"";
        if(menuItem.id!==curMenuKey){
            this.setState({
                currentLeftMenu:this.findMenuItem(this.menuData,menuItem.id)
            })
        }
    }

    handleMenuItemClick = (e)=>{
        var menuItem = this.findMenuItem(this.menuData,e.key);
        if(menuItem.url){
            this.changeRoute(menuItem.url);
        }
    }

    createSubMenuOrMenuItem(item){
        if(!item){
            return <div></div>
        }
        return item.children.map(item=>{
            if(item.children.length>0){
                return (
                    <SubMenu  key={item.id} title={<span><Icon type={item.icon} />{item.label}</span>}>
                        {
                            item.children.map(it=>{
                                return this.createSubMenuOrMenuItem(it);
                            })
                        }
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item onClick={this.handleMenuItemClick} key={item.id}>{item.label}</Menu.Item>
                );
            }

        });
    }

    render() {
        let {RouteComponents,Services} = this.props; //获取路由组件
        const routes = this.state.routes.map(route=>{
            return {
                breadcrumbName:route.title,
                path:route.name?Services.Route.getPath(route.name,route.paras):""
            }
        });
        return (
            <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
                onClick={this.handleMenuClick}
              >
              {
                this.menuData.map(item=>{
                    return (
                        <Menu.Item key={item.id}>{item.label}</Menu.Item>
                    )
                })
              }
              </Menu>
            </Header>
            <Layout>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                {
                    this.createSubMenuOrMenuItem(this.state.currentLeftMenu)
                }
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }} itemRender={this.itemRender} routes={routes}></Breadcrumb>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                    {RouteComponents}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        )
    }

}