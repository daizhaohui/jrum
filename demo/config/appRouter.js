import React from 'react';
import Bundle  from '../../jrum/react-redux/bundle';
import queryList from 'bundle-loader?lazy&name=test!../components/queryList'
import registerForm from 'bundle-loader?lazy&name=test!../components/registerForm'
import helloWord from 'bundle-loader?lazy&name=test!../components/helloWord'


const  AppRouter = {
    data:[
    {
        name: "queryList",
        path: "/queryList",
        component: (props) => (<Bundle load={queryList}>
                    {(Comp) => <Comp {...props}/>}
                 </Bundle>)
    },
    {
        name: "registerForm",
        path: "/registerForm",
        component: (props) => (<Bundle load={registerForm}>
                    {(Comp) => <Comp {...props}/>}
                 </Bundle>)
    },
    {
        name: "helloWord",
        path: "/hello",
        component: (props) => (<Bundle load={helloWord}>
                    {(Comp) => <Comp {...props}/>}
                 </Bundle>)
    },
    ]
};

export  default  AppRouter;

