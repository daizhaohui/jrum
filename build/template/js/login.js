import React from 'react';
import ReactDOM from 'react-dom';
import {Components} from 'jrum';
import LoginConfig from '../../temp/login.config.js';
class Root extends  React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        let {LoginEntry} = Components;
        return (
            <LoginEntry Config={LoginConfig}/>
        );
    }
}
ReactDOM.render(<Root />, document.getElementById('loginContent'));