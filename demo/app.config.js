import React from 'react';
import Loadable from 'react-loadable';
import {LazyLoading} from 'jrum';
import hello from './components/controls/hello';
import menuList from './components/menu/menuList';
import httpPlugin from './plugins/httpPlugin';
var AppInfo = {menuLayout:'topLeft'};

const Routes=[
{name:'tableList',path:'/controls/tableList',component:Loadable({loader: () => import(/* webpackChunkName: "t1" */ "./components/controls/tableList/tableListController"), loading:LazyLoading})},
{name:'hello',path:'/hello',component:hello},
{name:'menuList',path:'/menuList',component:menuList}
];

const Services=[];

const ApiUrls=[
{name:'login',url:'http://localhost:8008/v1/login'},
{name:'privilege',url:'http://localhost:8008/v1/privilege/:name'},
{name:'userMenus',url:'http://localhost:8008/v1/menus/:name'},
{name:'menus',url:'http://localhost:8008/v1/menus'},
{name:'addMenu',url:'http://localhost:8008/v1/menu/add'},
{name:'deleteMenu',url:'http://localhost:8008/v1/menu/delete/:id'},
{name:'updateMenu',url:'http://localhost:8008/v1/menu/update'},
{name:'test3',url:'test3'},
{name:'test1',url:'test3'}
];

const Plugins=[
{name:'http',component:httpPlugin}
];

export default {Routes,Services,ApiUrls,Plugins,AppInfo}