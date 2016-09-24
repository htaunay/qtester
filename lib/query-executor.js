var request = require("request");

// *************************** Private Methods ***************************** //

var isQueryObjValid = function(queryObj) {

    var mkt = queryObj["mkt"];
    var mktRegex = /[a-z]{2}-[A-Z]{2}/;
    if(mkt === undefined || !mktRegex.test(mkt))
        return false;

    var query = queryObj["query"];
    var queryRgx = /[a-zA-Z0-9\s]+/;
    if(query === undefined || !queryRgx.test(query))
        return false;

    return true;
};

var searchEngineRoot = {

    "bing": "http://www.bing.com/?",
    "google": "http://www.google.com/#",
    "duckduckgo": "http://duckduckgo.com/?"
};

var buildQueryUrl = function(queryObj) {

    return searchEngineRoot[queryObj["searchEngine"]] +
           "mkt=" + queryObj["mkt"] + "&" +
           "q=" + queryObj["query"];
};

// ****************************** Public API ******************************* //

var executeQuery = function(queryObj, cb) {

    if(!isQueryObjValid(queryObj)) {
        var objString = JSON.stringify(queryObj);
        cb(new Error("Incomplete query object given: " + objString));
    }

    var queryUrl = buildQueryUrl(queryObj);
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            cb(null, body);
        }
        else {
            cb(new Error("Unsuccessful response from " +
                queryObj["searchEngine"] + ". " +
                "Response = [" + response + "]."));
        }
    });
};

module.exports = executeQuery;
