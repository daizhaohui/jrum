import React,{Component} from 'react';
import Logger from '../utils/logger';

export default  class LazyLoading extends Component{

    constructor(props){
        super(props);
    }

    render() {
        return null;
        // if (this.props.isLoading) {
        //     if (this.props.timedOut) {
        //         return <div>Loader timed out!</div>;
        //     } else if (this.props.pastDelay) {
        //         return <div>Loading...</div>;
        //     } else {
        //         return null;
        //     }
        // } else if (this.props.error) {
        //     if(process.env.NODE_ENV==='development'){
        //         Logger.error(this.props.error);
        //     }
        //     return <div>Error! Component failed to load</div>;

        // } else {
        //     return null;
        // }
    }
}
