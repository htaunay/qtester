
var addPrefix = function(objArray, key, text) {

    var copy = JSON.parse(JSON.stringify(objArray));
    for(var i = 0; i < objArray.length; i++) {

        copy[i][key] = text + copy[i][key]; 
    }

    return copy;
};

var brazillianTeams = [

    {"query": "flamengo", "expectedValue": "Flamengo"},
    {"query": "palmeiras", "expectedValue": "Palmeiras"},
    {"query": "atletico mg", "expectedValue": "Atlético-MG"},
    {"query": "cruzeiro", "expectedValue": "Cruzeiro"},
    {"query": "botafogo", "expectedValue": "Botafogo"},
    {"query": "santos", "expectedValue": "Santos"},
    {"query": "corinthians", "expectedValue": "Corinthians"},
    {"query": "atletico pr", "expectedValue": "Atlético-PR"},
    {"query": "ponte preta", "expectedValue": "Ponte Preta"},
    {"query": "chapecoense", "expectedValue": "Chapecoense"},
    {"query": "gremio", "expectedValue": "Grêmio"},
    {"query": "coritiba", "expectedValue": "Coritiba"},
    {"query": "sport", "expectedValue": "Sport"},
    {"query": "cruzeiro", "expectedValue": "Cruzeiro"},
    {"query": "vitoria", "expectedValue": "Vitória"},
    {"query": "figueirence", "expectedValue": "Figueirense"},
    {"query": "america mg", "expectedValue": "América-MG"},
    {"query": "internacional", "expectedValue": "Internacional"},
    {"query": "santa cruz", "expectedValue": "Santa Cruz"},
    {"query": "sao paulo", "expectedValue": "São Paulo"},
    {"query": "fluminense", "expectedValue": "Fluminense"}
];

var testSpec = {

    "name": "Soccer",
    "testRoot": {
        "searchEngine": "bing",
        "mkt": "pt-BR",
        "condition": "equals",
        "_children_": [
        {
            "path": "div#sp-title h2",
            "attribute": "text",
            "_children_": addPrefix(brazillianTeams, "query", "ultimo jogo ")
        },
        {
            "path": "div#sp-title .b_topTitle",
            "attribute": "text",
            "_children_": addPrefix(brazillianTeams, "query", "proximo jogo ")
        }
        ]
    }
};

module.exports = testSpec;
