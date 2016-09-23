var jsdom = require("jsdom");
var jquery = require("jquery");

var Attributes = [

    "id",
    "class",
    "href",
    "text"
];

var Conditions = [

    "equals",
    "contains"
];

// *************************** Private Methods ***************************** //

var isTestObjValid = function(testObj) {

    var path = testObj["path"];
    if(path === undefined || typeof(path) !== "string")
        return false;

    var attribute = testObj["attribute"];
    if(attribute === undefined || !(attribute in Attributes))
        return false;

    var condition = testObj["condition"];
    if(condition === undefined || !(condition in Conditions))
        return false;

    var expectedValue = testObj["expectedValue"];
    if(expectedValue === undefined)
        return false;

    return true;
};

var getAttributeValue = function(element, testObj) {

    var attribute = testObj["attribute"];
    if(attribute == "text")
        return element.text();
    else
        return element.attr(testObj["attribute"]);
};

var conditionIsMatched = function(value, testObj) {

    var condition = testObj["condition"];
    var expectedValue = testObj["expectedValue"];

    // Create result object
    var resultObj = {};
    resultObj.name = testObj["name"];
    resultObj.passed = false;
    resultObj.condition = condition;
    resultObj.actualValue = value;
    resultObj.expectedValue = expectedValue;

    if(value !== undefined) {

        switch(condition) {

            case "equals":
                resultObj.passed = (value == expectedValue);
                break;

            case "contains":
                resultObj.passed = (value.indexOf(expectedValue) !== -1);
                break;
        };
    }

    return resultObj;
};

// ****************************** Public API ******************************* //

var checkDom = function(htmlBody, testObj, cb) {

    jsdom.env(htmlBody, function(error, window) {

        if(!error) {

            var element = jquery(window)(testObj["path"]);
            var attributeValue = getAttributeValue(element, testObj);

            cb(null, conditionIsMatched(attributeValue, testObj));
        }
        else {
            cb(new Error("Error while parsing html within jsdom"));
        }
    });
};

module.exports = checkDom;
