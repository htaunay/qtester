require("should");

var qtester = require("../lib/qtester");
// Test wrapper, in order to avoid:
// * waiting for timeouts after should exceptions
// * wrtinting try/catches in all test cases
var runTest = function(testSpec, done, cb) {

    qtester(testSpec, function(err, testResults) {
       
        try {
    
            cb(err, testResults);
            done();       
        }
        catch(err) {
        
            done(err) ;           
        };
    });
};

describe("The qteser module", function() {

    it("should run a single test successfully", function(done) {

        var testSpec = {

            "name": "Single",
            "testRoot": {
               "searchEngine": "bing",
               "mkt": "pt-BR",
               "query": "test",
               "path": "input#sb_form_q",
               "attribute": "value",
               "condition": "equals",
               "expectedValue": "test"
            }
        };

        runTest(testSpec, done, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.True();
            testResults[0].name.should.be.eql('Single');
        });
    });

    it("should run multiple tests successfully", function(done) {

        var testSpec = {

            "name": "Multiple",
            "testRoot": {
                "searchEngine": "duckduckgo",
                "mkt": "pt-BR",
                "query": "passed",
                "path": "input#search_form_input",
                "attribute": "value",
                "condition": "equals",
                "_children_": [
                    {"expectedValue": "passed"},
                    {"expectedValue": "failed"}
                ]
            }
        };

        runTest(testSpec, done, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.True();
            testResults[1].passed.should.be.False();
            testResults[1].name.should.be.eql('Multiple');
        });
    });

    it("should run successfully with a file input", function(done) {

        /*
         * Contents of ./test/testInput.json
         *
         *
         * {
         *     "name": "FileInput",
         *     "testRoot": {
         *         "searchEngine": "bing",
         *         "mkt": "pt-BR",
         *         "query": "textinput",
         *         "path": "input#sb_form_q",
         *         "attribute": "value",
         *         "condition": "contains",
         *         "_children_": [
         *             {"expectedValue": "tinp"},
         *             {"expectedValue": "tiinp"}
         *         ]
         *     }
         * }
         *
         */

        runTest("./test/testInput.json", done, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.True();
            testResults[1].passed.should.be.False();
            testResults[1].name.should.be.eql('FileInput');
        });
    });

    it("should throw an error when given invalid input", function(done) {

        runTest("{ invalid json file }", done, function(err, testResults) {

            (err === null).should.be.False();
            var expectedError = 'Invalid test configuration given: "{ invalid json file }"';
            err.message.should.be.eql(expectedError);
        });
    });

    it("should return an error object for invalid test variables", function(done) {

        var invalidTestSpec = {

            "name": "Invalid",
            "testRoot": {
                "searchEngine": "fakesearchengine", // <- problem
                "mkt": "pt-BR",
                "query": "passed",
                "path": "input#search_form_input",
                "attribute": "value",
                "condition": "equals",
                "expectedValue": "failed"
            }
        };

        runTest(invalidTestSpec, done, function(err, testResults) {

            (err === null).should.be.True();
            testResults[0].passed.should.be.False();

            var expectedError = "Incomplete or invalid query object given";
            testResults[0].error.message.should.containEql(expectedError);
        });
    });
});
