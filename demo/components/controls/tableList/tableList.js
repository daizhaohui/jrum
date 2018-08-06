import React from 'react';

export default  class TableList extends React.Component{

    constructor(props){
        super(props);
    }

    addItem = ()=>{
        let {onAddItem} = this.props;
        onAddItem();
    }

    render() {
        let {list} = this.props;
        this.services.global.set("user",{
            name:"admin"
        });
        return (
            <div>
                hello,world!:{list}
                <button onClick={this.addItem}>Click Me</button>
            </div>
        );
    }

}