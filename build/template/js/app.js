import React from 'react';
import ReactDOM from 'react-dom';
import {Components} from 'jrum'
import AppConfig from '../../temp/app.config.js';;

class Root extends  React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        let {AppEntry} = Components;
        return (
            <AppEntry appConfig={AppConfig}/>
        );
    }
}
ReactDOM.render(<Root />, document.getElementById('appContent'));