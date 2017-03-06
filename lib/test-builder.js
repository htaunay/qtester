
// *************************** Private Methods ***************************** //

var isTestSpecValid = function(testSpec) {

    if(testSpec === undefined || testSpec === null)
        return false;

    var name = testSpec["name"];
    if(name === undefined || typeof(name) !== "string" || name.length == 0)
        return false;

    // testRoot must be object
    var root = testSpec["testRoot"];
    if(root === undefined || !((!!root) && (root.constructor === Object)))
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

var buildTestScript = function(testSpec, cb) {

    if(!isTestSpecValid(testSpec)) {
        var objString = JSON.stringify(testSpec);
        cb(new Error("Invalid test configuration given: " + objString));
    }

    var result = [];
    var initialState = { "name": testSpec["name"] };
    populateTestArray(testSpec["testRoot"], initialState, result);

    cb(null, result);
};

module.exports = buildTestScript;
