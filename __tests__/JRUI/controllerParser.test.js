import ControllerParser from '../../jrum/react-redux/controllerParser';
import {Controller,DataTypes} from '../../jrum';

process.env.NODE_ENV='development';



test("controllerParser:valid controller",()=>{

    class TableListController{
        constructor(){

        }

        uniqueName(){
            return "test1"
        }

        state(){

        }

        mapActionToProps(){

        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/^constructor's/);


});

test("controllerParser:controller's uniqueName()",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return {a:'abc'}
        }

        mapActionToProps(){

        }

        state(){

        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/^Controller uniqueName's/);

});

test("controllerParser:controller's state()",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
           return "abc"
        }

        mapActionToProps(){

        }

        state(){
            return 12;
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/^Controller state's/);

});

test("controllerParser:controller's mapActionToProps()",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){

        }

        state(){
            return {
                list:{
                    default:"a"
                }
            }
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/^Controller mapActionToProps's/);

});

test("controllerParser:controller's mapActionToProps()",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){

        }

        state(){
            return {
                list:{
                    default:"a"
                }
            }
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/^Controller mapActionToProps's/);

});

test("controllerParser:throw  defaultValue or dataType not define ",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){
            return {
                test:()=>{}
            }

        }

        state(){
            return {
                list:{
                    defaultValue:"a",
                }
            }
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/define defaultValue and dataType$/);

});

test("controllerParser:throw  dataType is invalid ",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){
            return {
                test:()=>{}
            }

        }

        state(){
            return {
                list:{
                    defaultValue:"a",
                    dataType:10
                }
            }
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/DataTypes.String/);

});

test("controllerParser:throw  mapActionToProps item must be function",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){
            return {
                test:()=>{},
                action:{}
            }

        }

        state(){
            return {
                list:{
                    defaultValue:"a",
                    dataType:DataTypes.String
                }
            }
        }
    }

    var controllerParser = new ControllerParser(new TableListController());
    expect(()=>{controllerParser.check()}).toThrowError(/expected to be function$/);
});

test("controllerParser:getMapStateToProps",()=>{

    class TableListController extends Controller{
        constructor(){
            super();
        }

        uniqueName(){
            return "abc"
        }

        mapActionToProps(){
            return {
                test:()=>{},
                action:{}
            }

        }

        state(){
            return {
                item:{
                    defaultValue:"a",
                    dataType:DataTypes.String,
                    prop:'item'
                },
                list:{
                    defaultValue:[1,2,3],
                    dataType:DataTypes.Array,
                    prop:'list'
                },
                none:{
                    defaultValue:[1,2,3],
                    dataType:DataTypes.Array
                },
            }
        }
    }
    var state = {

    };

    var controllerParser = new ControllerParser(new TableListController());
    var result = controllerParser.getMapStateToProps(state);
   // console.log("result:"+JSON.stringify(result));
    expect(result['item']).toBe('a');
    expect(result['list'][0]).toBe(1);
    expect(result['none']).toBeUndefined();

    state[controllerParser.controllerName] = {};
    state[controllerParser.controllerName].item = "b";
    state[controllerParser.controllerName].list = [0];

    result = controllerParser.getMapStateToProps(state);
    //console.log("result:"+JSON.stringify(result));
    expect(result['item']).toBe('b');
    expect(result['list'][0]).toBe(0);
    expect(result['none']).toBeUndefined();

});