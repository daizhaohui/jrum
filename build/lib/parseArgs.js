const Argv = require('./argv')

function parseArgv(argv){
    var i,
        len,
        arg,
        index;

    len = argv.length;
    if(len>2){
        for(i=2;i<len;i++) {
            arg = argv[i];
            index = arg.indexOf('--');
            if(index>=0){
                i++;
                i<len && (Argv[arg.slice(index+2)] = argv[i]);
            }
        }
    }
    return Argv;
}

module.exports = parseArgv;
