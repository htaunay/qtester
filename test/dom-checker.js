require("should");
var checkDom = require("../lib/dom-checker");

describe("The dom-check module", function() {
   
    var simpleBody = "<p>This is a P tag</p><h1>This is a H1 tag</h1>";
    var bodyWithTags = "<span id='ABC'><a class='XYZ' href='localhost'>Link Name</a></span>";

    it("should return true to a correct 'equals' condition", function(done) {

        var testObj = {
            "path": "p",
            "attribute": "text",
            "condition": "equals",
            "expectedValue": "This is a P tag"
        };

        checkDom(simpleBody, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.True();
            done();
        });
    });

    it("should return false to an incorrect 'equals' condition", function(done) {

        var testObj = {
            "path": "p",
            "attribute": "text",
            "condition": "equals",
            "expectedValue": "This is a P"
        };

        checkDom(simpleBody, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.False();
            done();
        });
    }); 

    it("should return true to a correct 'contains' condition", function(done) {

        var testObj = {
            "path": "h1",
            "attribute": "text",
            "condition": "contains",
            "expectedValue": "H1 tag"
        };

        checkDom(simpleBody, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.True();
            done();
        });
    });

    it("should return false to an incorrect 'contains' condition", function(done) {

        var testObj = {
            "path": "h1",
            "attribute": "text",
            "condition": "contains",
            "expectedValue": "H1   tag"
        };

        checkDom(simpleBody, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.False();
            done();
        });
    });

    it("should be able to access an element's id", function(done) {

        var testObj = {
            "path": "span",
            "attribute": "id",
            "condition": "equals",
            "expectedValue": "ABC"
        };

        checkDom(bodyWithTags, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.True();
            done();
        });
    });

    it("should be able to access an element's attribute", function(done) {

        var testObj = {
            "path": "a",
            "attribute": "href",
            "condition": "equals",
            "expectedValue": "localhost"
        };

        checkDom(bodyWithTags, testObj, function(error, resultObj) {
           
            resultObj["passed"].should.be.True();
            done();
        });
    });
});
