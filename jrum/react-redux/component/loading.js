import React from 'react';
import {Spin} from 'antd';

const Styles = {
    container:{
        width:'100%'
    }
    
};

export default class Loading extends React.Component{

    constructor(props){
        super(props);
    }

    render() {
        let {tip,visible} = this.props;
        let style = {
            ...Styles.container,
            display:`${visible===true?'block':'none'}`
        }
        return (
            <div style={Styles.container}>
                <Spin size="large" tip={tip}>

                </Spin>
            </div>
        )
    }
}