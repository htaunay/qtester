var fs = require('fs');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

// Extend Array object for entire project
Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
};

var checkDom = Promise.promisify(require("./dom-checker"));
var executeQuery = Promise.promisify(require("./query-executor"));
var buildTestScript = Promise.promisify(require("./test-builder"));

// *************************** Private Methods ***************************** //

var loadJsonFile = function(testInput) {

    try {

        var testInputSplit = testInput.split('.');
        var testInputSuffix = testInputSplit[testInputSplit.length-1];

        if(testInputSuffix == 'json') {

            var testFile = fs.readFileSync(testInput, 'utf-8');
            return JSON.parse(testFile);
        }

        if(testInputSuffix == 'js')
            return require(process.cwd() + '/' + testInput);

        return testInput;

    } catch (err) {

        return testInput;
    }
};

var executeTest = Promise.promisify(function(testObj, cb) {

    return executeQuery(testObj)
        .then(function(htmlBody) {

            return checkDom(htmlBody, testObj);
        })
        .then(function(testResultObj) {

            cb(null, testResultObj);
        })
        .catch(function(err) {

            var errorObj = {
                "query": testObj.query,
                "path": testObj.path,
                "expectedValue": testObj.expectedValue,
                "actualValue": testObj.value,
                "condition": testObj.condition,
                "passed": false,
                "error": err
            };

            cb(null, errorObj);
        })
    ;
});

var executeTestScript = async (function(testScript) {

    var testResults = [];
    for(var i = 0; i < testScript.length; i++) {

        var testResult = await(executeTest(testScript[i]));
        testResults.push(testResult);
    }

    return testResults;
});

// ****************************** Public API ******************************* //

var runTest = function(testSpec, cb) {

    testSpec = loadJsonFile(testSpec);

    var testError = null;
    buildTestScript(testSpec)
        .then(function(testScript) {

            return executeTestScript(testScript);
        })
        .catch(function(err) {

            testError = err;
        })
        .then(function(testResults) {

            cb(testError, testResults);
        })
    ;
};

module.exports = runTest;
