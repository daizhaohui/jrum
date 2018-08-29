module.exports = {
    verbose: true,
    testPathIgnorePatterns:["/__tests__/data/","/node_modules/"],
    "transform": {"^.+\\.jsx?$": "babel-jest"},
    "moduleFileExtensions": ["js", "json", "es6","jsx"]
};