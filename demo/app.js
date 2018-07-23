import React from 'react';
import ReactDOM from 'react-dom';
import {AppEntry} from 'jrum'
import AppConfig from './app.config';

class Root extends  React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }


    render() {
        return (
            <AppEntry appConfig={AppConfig}/>
        );
    }
}
ReactDOM.render(<Root />, document.getElementById('appContent'));