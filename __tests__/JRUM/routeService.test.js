import RouteService from '../../jrum/services/RouteService';
var route,
    mockHistory;

beforeEach(() => {
    mockHistory = {
        push: function (path) {
            return path;
        }
    };
    route = new RouteService([
        {
            name:'r1',
            path:'/r1/a'
        },
        {
            name:'r2',
            path:'/r2/b'
        },
        {
            name:'r3',
            path:'/r3/:id/:name'
        },
        {
            name:'r4',
            path:'/r4/:id'
        }
    ],mockHistory);

});

afterEach(() => {

});

test("routeService:push",()=>{

    expect(route.push('r1')).toBe('/r1/a');
    expect(route.push('r3')).toBe('/r3/:id/:name');
    expect(route.push('r0')).toBeUndefined();
    expect(route.push('r4',{
        id:1
    })).toBe('/r4/1');
    expect(route.push('r3',{
        id:1,
        name:'xixi'
    })).toBe('/r3/1/xixi');

});

