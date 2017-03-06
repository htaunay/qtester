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

    it("should be able to access an element's value by its id", function(done) {

        var testObj = {
            "path": "span#ABC",
            "attribute": "text",
            "condition": "equals",
            "expectedValue": "Link Name"
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

    /*it("should return an error when given an invalid dom object", function(done) {

        var testObj = {
            "path": "a",
            "attribute": "href",
            "condition": "equals",
            "expectedValue": "localhost"
        };

        checkDom({"something": 123}, testObj, function(error, resultObj) {

            (error == null).should.be.False();
            (resultObj === undefined).should.be.True();
            done();
        });
    });*/

    describe("should return an error when given an invalid test object", function() {

        it("with a missing 'path' variable", function(done) {

            var testObj = {
                "attribute": "href",
                "condition": "equals",
                "expectedValue": "localhost"
            };

            checkDom(bodyWithTags, testObj, function(error, resultObj) {

                (error == null).should.be.False();
                (resultObj === undefined).should.be.True();
                done();
            });
        });

        it("with a missing 'attribute' variable", function(done) {

            var testObj = {
                "path": "a",
                "condition": "equals",
                "expectedValue": "localhost"
            };

            checkDom(bodyWithTags, testObj, function(error, resultObj) {

                (error == null).should.be.False();
                (resultObj === undefined).should.be.True();
                done();
            });
        });

        it("with a missing 'condition' variable", function(done) {

            var testObj = {
                "path": "a",
                "attribute": "href",
                "expectedValue": "localhost"
            };

            checkDom(bodyWithTags, testObj, function(error, resultObj) {

                (error == null).should.be.False();
                (resultObj === undefined).should.be.True();
                done();
            });
        });

        it("with a missing 'expectedValue' variable", function(done) {

            var testObj = {
                "path": "a",
                "attribute": "href",
                "condition": "equals"
            };

            checkDom(bodyWithTags, testObj, function(error, resultObj) {

                (error == null).should.be.False();
                (resultObj === undefined).should.be.True();
                done();
            });
        });
    });
});
