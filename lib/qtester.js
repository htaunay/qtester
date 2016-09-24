var fs = require('fs');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var checkDom = Promise.promisify(require("./dom-checker"));
var executeQuery = Promise.promisify(require("./query-executor"));
var buildTestScript = Promise.promisify(require("./test-builder"));

// *************************** Private Methods ***************************** //

var loadJsonFile = function(testInput) {

    try {

        var testFile = fs.readFileSync(testInput, 'utf-8');
        var testSpec = JSON.parse(testFile);

        return testSpec;

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

    buildTestScript(testSpec)
        .then(function(testScript) {

            return executeTestScript(testScript);
        })
        .then(function(testResults) {

            cb(null, testResults);
        })
        .catch(function(err) {

            cb(err);
        })
    ;
};

module.exports = runTest;
