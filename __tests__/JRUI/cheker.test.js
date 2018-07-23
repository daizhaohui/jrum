import {Controller} from '../../jrum';
import Checker from '../../jrum/utils/checker';
import React from 'react';


test("checker.isController",()=>{

    class TestController extends Controller{

    }

    expect(Checker.isController([1,2])).toEqual(false);
    expect(Checker.isController("check")).toEqual(false);
    expect(Checker.isController(true)).toEqual(false);
    expect(Checker.isController(100)).toEqual(false);
    expect(Checker.isController({})).toEqual(false);
    expect(Checker.isController(new TestController())).toEqual(true);

});

test("checker.isFunction",()=>{

    function testFunction(){

    }
    expect(Checker.isFunction([])).toEqual(false);
    expect(Checker.isFunction(null)).toEqual(false);
    expect(Checker.isFunction({})).toEqual(false);
    expect(Checker.isFunction(undefined)).toEqual(false);
    expect(Checker.isFunction("abc")).toEqual(false);
    expect(Checker.isFunction(100)).toEqual(false);
    expect(Checker.isFunction(testFunction)).toEqual(true);


});


test("checker.isPlainObject",()=>{

    function testFunction(){

    }
    expect(Checker.isPlainObject([1,2,3])).toEqual(false);
    expect(Checker.isPlainObject(null)).toEqual(false);
    expect(Checker.isPlainObject(undefined)).toEqual(false);
    expect(Checker.isPlainObject("abc")).toEqual(false);
    expect(Checker.isPlainObject(100)).toEqual(false);
    expect(Checker.isPlainObject(testFunction)).toEqual(false);
    expect(Checker.isPlainObject({})).toEqual(true);

});

/*
test("checker.isReactComponent",()=>{
    class comp1 extends React.Component {
        constructor(props){
            super(props);
        }
    }

    class comp2 {
        constructor(){

        }
    }

    class comp3 extends  comp1{
        constructor(props){
            super(porps);
        }
    }

    var comp4 = {

    };

    Object.defineProperty(comp1.prototype,"test",{
        writable:false,
        value:1,
        configurable:false,
        enumerable:true
    });


    expect(Checker.isReactComponent(comp1)).toEqual(true);
    expect(Checker.isReactComponent(comp2)).toEqual(false);
    expect(Checker.isReactComponent(comp3)).toEqual(true);
    expect(Checker.isReactComponent(comp4)).toEqual(false);

    var comp1Instance = new comp1();
    expect(comp1Instance.test).toEqual(1);

});
*/