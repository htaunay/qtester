require("should");
var buildTest = require("../lib/test-builder");

describe("The test-builder module", function() {

    it("should build a correct test script from an test spec tree", function(done) {

        var testSpec = {

            "name": "TestSpecName",
            "testRoot": {
               "mkt": "pt-BR",
                "_children_" : [
                {
                    "q": "X",
                    "_children_": [{"test": "123"}, {"something": 456}]
                },
                {
                    "q": "Y",
                    "_children_": [{"test": 321.0}, {"else": null}]
                }
                ]
            }
        };

        buildTest(testSpec, function(err, testArray) {

            (err == null).should.be.True();
            (testArray instanceof Array).should.be.True();

            testArray.should.containEql(
                { name: 'TestSpecName', mkt: 'pt-BR', q: 'X', test: '123' }
            );
            testArray.should.containEql(
                { name: 'TestSpecName', mkt: 'pt-BR', q: 'X', something: 456 }
            );
            testArray.should.containEql(
                { name: 'TestSpecName', mkt: 'pt-BR', q: 'Y', test: 321.0 }
            );
            testArray.should.containEql(
                { name: 'TestSpecName', mkt: 'pt-BR', q: 'Y', else: null }
            );

            done();
        });
    });
});
