require("should");
var fs = require('fs');
var checkDom = require("../lib/dom-checker");
var executeQuery = require("../lib/query-executor");

describe("The query-executor module", function() {

    it("should return an expected body for a given query obj", function(done) {

        var queryObj = {
            "searchEngine": "bing",
            "mkt": "pt-BR",
            "query": "test",
            "flight": "abc123"
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

    it("should return an error when given an invalid query obj", function(done) {

        // in this obj, the 'query' property is missing
        var queryObj = {
            "searchEngine": "bing",
            "mkt": "pt-BR",
            "random": "value"
        };

        executeQuery(queryObj, function(err, htmlBody) {

            (err == null).should.be.False();
            (htmlBody === undefined).should.be.True();
            done();
        });
    });

    it("should return an error when given an empty query obj", function(done) {

        executeQuery(null, function(err, htmlBody) {

            (err == null).should.be.False();
            (htmlBody === undefined).should.be.True();
            done();
        });
    });
});
