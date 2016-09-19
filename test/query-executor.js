require("should");
var fs = require('fs');
var checkDom = require("../lib/dom-checker");
var executeQuery = require("../lib/query-executor");

describe("The query-executor module", function() {

    it("should return an expected body for a given query obj", function(done) {
    
        var queryObj = {
            "searchEngine": "bing",
            "mkt": "pt-BR",
            "query": "test"
        };

        executeQuery(queryObj, function(err, htmlBody) {
           
            var testObj = {
                "path": "input#sb_form_q",
                "attribute": "value",
                "condition": "equals",
                "expectedValue": "test"
            };

            checkDom(htmlBody, testObj, function(error, resultObj) {

                resultObj["passed"].should.be.True();
                done();
            });
        });
    });
});
