import React from 'react';
import Loadable from 'react-loadable';
import {LazyLoading} from 'jrum';
import hello from './components/controls/hello';
import httpPlugin from './plugins/httpPlugin';
var AppInfo = {menuLayout:'topLeft'};

const Routes=[
{name:'tableList',path:'/controls/tableList',component:Loadable({loader: () => import(/* webpackChunkName: "t1" */ "./components/controls/tableList/tableListController"), loading:LazyLoading})},
{name:'hello',path:'/hello',component:hello}
];

const Services=[];

const ApiUrls=[
{name:'login',url:'http://127.0.0.1:8008/v1/login'},
{name:'test2',url:'test2'},
{name:'test3',url:'test3'},
{name:'test1',url:'test3'}
];

const Plugins=[
{name:'http',component:httpPlugin}
];

export default {Routes,Services,ApiUrls,Plugins,AppInfo}