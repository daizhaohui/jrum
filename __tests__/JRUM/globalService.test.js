import GloableService from '../../jrum/services/globalService';
import Logger from '../../build/lib/logger';

var global;

beforeEach(() => {
    global = new GloableService(Logger);
    process.env.NODE_ENV='development';
});

test("globalService",()=>{
    var val;

    global.set("a",1);
    val = global.get("a")
    expect(val).toBe(1);

    global.set("a","1");
    val = global.get("a")
    expect(val).not.toBe(1);
    expect(val).toBe("1");

    global.set("a",[1,2,3]);
    val = global.get("a")
    expect(val.length).toBe(3);

    expect(function(){global.set("a.b.c",1)}).toThrowError(/变量不是对象/);

    expect(function(){global.get("a.d")}).toThrowError(/变量不是对象/);

    global.set("b.c.d","abc");
    val = global.get("b.c.d");
    expect(val).toEqual("abc");

    global.set("b.c.e.f.g",{
        x1:1,
        x2:2
    });
    val = global.get("b.c.e.f.g");
    expect(val.x2).toBe(2);

    global.set("b.c.e.f.h",null);
    val = global.get("b.c.e.f.h");
    expect(val).toBe(null);

    global.log();



});
