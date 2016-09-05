
// *************************** Private Methods ***************************** //

var isTestConfigValid = function(testConfig) {

    var name = testConfig["name"];
    if(name === undefined || typeof(name) !== "string" || name.length == 0)
        return false;

    // testRoot must be object
    var root = testConfig["testRoot"];
    if(root === undefined || (!!root) && (root.constructor === Object))
        return false;

    return true;
};

var populateTestArray = function(currentNode, currentState, testArray) {

    var childrenNode = null;
    for(var key in currentNode) {

        if(key == "_children_") {
            childrenNode = currentNode["_children_"];
            continue;
        }

        currentState[key] = currentNode[key];
    }

    if(childrenNode != null && childrenNode.constructor === Array) {

        for(var i = 0; i < childrenNode.length; i++) {
            var stateCopy = JSON.parse(JSON.stringify(currentState));
            populateTestArray(childrenNode[i], stateCopy, testArray);
        }
    }
    else {
        var stateCopy = JSON.parse(JSON.stringify(currentState));
        testArray.push(stateCopy);
    }
};

// ****************************** Public API ******************************* //

var buildTestScript = function(testConfig, cb) {

    if(!isTestConfigValid(testConfig)) {
        var objString = JSON.stringify(testConfig);
        cb(new Error("Invalid test configuration given: " + objString));
    }

    var array = [];
    var obj = {
        "mkt": "pt-BR",
        "_children_" : [
        {
            "q": "X",
            "_children_": [{"test": "123"}, {"something": "456"}]
        },
        {
            "q": "Y",
            "_children_": [{"test": "321"}, {"else": "654"}]
        }
        ]
    };
    populateTestArray(obj,{},array);
    console.log(JSON.stringify(array));
//    var queryUrl = buildQueryUrl(queryObj);
//    request(queryUrl, function (error, response, body) {
//
//        if (!error && response.statusCode == 200) {
//            cb(null, body);
//        }
//        else {
//            cb(new Error("Unsuccessfull response from Bing. " +
//                "Response = [" + response + "]."));
//        }
//    });
};

module.exports = buildTestScript;

