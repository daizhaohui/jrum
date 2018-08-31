var items = [
    {
        id:'yx',
        name:'营销',
        icon:'yx',
        url:'/markets',
        children:[{
            id:'yxch',
            name:'营销策划',
            icon:'yxch',
            url:'',
            children:[{
                id:'cxgl',
                name:'促销管理',
                icon:'cxgl',
                url:'/markets/promotion',
                children:[]
            },{
                id:'zsgl',
                name:'咨询管理',
                icon:'zsgl',
                url:'/markets/news',
                children:[]
            },{
                id:'dx',
                name:'短信',
                icon:'dx',
                url:'/markets/message',
                children:[]
            },{
                id:'yhq',
                name:'优惠券',
                icon:'yhq',
                url:'/markets/coupon',
                children:[]
            }]
        },{
            id:'yxtg',
            name:'营销推广',
            icon:'yxtg',
            url:'',
            children:[{
                id:'tfgl',
                name:'投放管理',
                icon:'icon-1',
                url:'/markets/putManageBigB',
                children:[] 
            },{
                id:'tfsh',
                name:'投放审核',
                icon:'icon-2',
                url:'/markets/auditlist',
                children:[] 
            },{
                id:'qdgl',
                name:'渠道管理',
                icon:'icon-2',
                url:'/markets/channelmgmt',
                children:[] 
            }] 
        },{
            id:'yxjs',
            name:'营销结算',
            icon:'icon-3',
            url:'',
            children:[{
                id:'jsdgl',
                name:'结算单管理',
                icon:'icon-4',
                url:'',
                children:[]  
            }]  
        }]
    },
    {
        id:'hy',
        name:'会员',
        icon:'yx',
        url:'',
        children:[{
            id:'hydy',
            name:'会员定义',
            icon:'i1',
            url:'',
            children:[{
                id:'zdgl',
                name:'字段管理',
                icon:'i2',
                url:'/member/fieldmanage/fieldinfomanage',
                children:[]
            },{
                id:'djgl',
                name:'等级管理',
                icon:'i3',
                url:'',
                children:[{
                    id:'djsz',
                    name:'等级设置',
                    icon:'p1',
                    url:'/member/levelmanage/levellist',
                    children:[]
                },{
                    id:'sjjgz',
                    name:'升降机规则',
                    icon:'p1',
                    url:'/member/levelmanage/levelrules',
                    children:[]
                }]
            }]
        },{
            id:'sz',
            name:'设置',
            icon:'s1',
            url:'',
            children:[{
                id:'ymsz',
                name:'域名设置',
                icon:'s1',
                url:'/member/memberexpand/domainset?type=set',
                children:[]
            }]
        }]
    },
    {
        id:'zjqx',
        name:'组织与权限',
        icon:'qx1',
        url:'/accounts',
        children:[{
            id:'zjqx',
            name:'组织与权限',
            icon:'qx1',
            url:'/accounts',
            children:[{
                id:'zj',
                name:'组织',
                icon:'zz',
                url:'/accounts/organization/organizationList',
                children:[]
            },{
                id:'yh',
                name:'用户',
                icon:'user',
                url:'/accounts/user/user-list',
                children:[]
            },{
                id:'js',
                name:'角色',
                icon:'js1',
                url:'/accounts/role/role-list',
                children:[]
            }]
        },{
            id:'jcsj',
            name:'基础数据',
            icon:'sj1',
            url:'',
            children:[{
                id:'yt',
                name:'业态',
                icon:'x1',
                url:'/accounts/retail/retail-list',
                children:[]
            },{
                id:'sp',
                name:'商铺',
                icon:'sp1',
                url:'/accounts/store/store-list',
                children:[]
            }]
        }]  
    },
    {
        id:'jsxt',
        name:'结算系统',
        icon:'qx1',
        url:'/accounts',
        children:[]
    }
];

module.exports = items;