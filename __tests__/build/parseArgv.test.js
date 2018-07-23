import parseArgv from '../../build/lib/parseArgs';


test("parseArgv:",()=>{
    var args = "node test.js --target target --output output";
    var argv = parseArgv(args.split(' '));
    expect(argv.target).toBe('target');
    expect(argv.output).toBe('output');
});