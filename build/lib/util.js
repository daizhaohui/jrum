const fs = require('fs');
const Error = require('./logger').error;
const CleanCSS = require('clean-css');
const CssMinify = new CleanCSS({});
const uglifyjs = require('uglify-js');
const path = require('path');

var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function _toObject(val) {
    if (val == null) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
}

function _ownEnumerableKeys(obj) {
    var keys = Object.getOwnPropertyNames(obj);

    if (Object.getOwnPropertySymbols) {
        keys = keys.concat(Object.getOwnPropertySymbols(obj));
    }

    return keys.filter(function (key) {
        return propIsEnumerable.call(obj, key);
    });
}

const _assign = Object.assign || function (target, source) {
    var from;
    var keys;
    var to = _toObject(target);

    for (var s = 1; s < arguments.length; s++) {
        from = arguments[s];
        keys = _ownEnumerableKeys(Object(from));

        for (var i = 0; i < keys.length; i++) {
            to[keys[i]] = from[keys[i]];
        }
    }

    return to;
};

function _fromJsonFileToObject(file) {
    try {
        return JSON.parse(fs.readFileSync(file));
    }catch(err){
        Error(`Parsing Json file [${file}] is failed:${err}`)
        return null;
    }
}

function _minifyCss(css,callback){
    CssMinify.minify(css,function (err,output){
        if(err){
            Error(err);
           return callback && callback(null);
        }
        else {
            return callback && callback(output.styles);
        }
    });
}

function _minifyJS(code){
    var content = uglifyjs.minify(code,{
        mangle:false,
        fromString:true,
    });
    content = content.code;
    return content;
}

function _removeDirectory(dir){
    _clearDirectory(dir);
    fs.rmdirSync(dir);
}

function _copyFileToDirectory(file,targetDirectory){
    fs.copyFileSync(file,path.resolve(targetDirectory,file.slice(file.lastIndexOf('/')+1)));
}

function _clearDirectory(dir){
    var subDirOrFile;
    if(fs.existsSync(dir)){
        fs.readdirSync(dir).forEach(function(file){
            subDirOrFile = path.resolve(dir,file);
           if(fs.statSync(subDirOrFile).isDirectory()){
               _clearDirectory(subDirOrFile);
               fs.rmdirSync(subDirOrFile);
           } else {
               fs.unlinkSync(subDirOrFile);
           }
        });
    }
}

function _createDirectory(parentDir,dirPath) {
    var dirs = dirPath.split('/'),
        pDir = parentDir;
    dirs.forEach(function(dir){
        if(dir){
            pDir = path.resolve(pDir,dir);
            if(!fs.existsSync(pDir)){
                fs.mkdirSync(pDir);
            }
        }
    });
}

module.exports = {
    fromJsonFileToObject:_fromJsonFileToObject,
    assign:_assign,
    minifyCss:_minifyCss,
    minifyJS:_minifyJS,
    clearDirecoty:_clearDirectory,
    removeDirectory:_removeDirectory,
    copyFileToDirectory:_copyFileToDirectory,
    createDirectory:_createDirectory
}