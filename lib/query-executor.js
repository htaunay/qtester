var request = require("request");

const QueryKeywords = [

    "mkt",
    "q",
    "path",
    "searchEngine",
    "query",
    "expectedValue",
    "name",
    "attribute",
    "condition"
];

// *************************** Private Methods ***************************** //

var isQueryObjValid = function(queryObj) {

    if(queryObj === undefined || queryObj === null)
        return false;

    var engine = queryObj["searchEngine"];
    if(searchEngineRootUrl[engine] === undefined)
        return false;

    var query = queryObj["query"];
    var queryRgx = /[a-zA-Z0-9\s]+/;
    if(query === undefined || !queryRgx.test(query))
        return false;

    return true;
};

var searchEngineRootUrl = {

    "bing": "http://www.bing.com/?",
    "google": "http://www.google.com/#",
    "duckduckgo": "http://duckduckgo.com/?"
};

var buildQueryUrl = function(queryObj) {

    var rootQuery = searchEngineRootUrl[queryObj["searchEngine"]] +
           "mkt=" + queryObj["mkt"] + "&" +
           "q=" + queryObj["query"];

    Object.keys(queryObj).forEach(function(key) {

        if(!QueryKeywords.contains(key)) {
            rootQuery += "&" + key + "=" + queryObj[key];
        }
    });

    return rootQuery;
};

// ****************************** Public API ******************************* //

var executeQuery = function(queryObj, cb) {

    if(!isQueryObjValid(queryObj)) {
        var objString = JSON.stringify(queryObj);
        cb(new Error("Incomplete or invalid query object given: " + objString));
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
