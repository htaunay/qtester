[![Build Status](https://travis-ci.org/htaunay/qtester.svg?branch=master)](https://travis-ci.org/htaunay/qtester)
[![Coverage Status](https://coveralls.io/repos/github/htaunay/qtester/badge.svg?branch=master)](https://coveralls.io/github/htaunay/qtester?branch=master)
[![View this project on NPM](https://img.shields.io/npm/v/qtester.svg)](https://npmjs.org/package/qtester)
[![Join the chat at https://gitter.im/htaunay/qtester](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/htaunay/qtester?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# qtester

## Index

* [Overview](#overview)
* [Installing](#installing)
* [The Test Spec](#the-test-spec)
   * [Basics](#basics)
   * [Keywords](#keywords)
   * [Input Types](#input-types)
* [Working with the package](#working-with-the-package)
* [Working with the CLI](#working-with-the-cli)

## Overview

A tool for testing results from search engines. In a nutshell, the user can
specify a set of tests through a JSON object, where each one will perform
a query to a given search engine and compare an element of the resulting DOM
with a given condition.

Therefore, each individual test should consist of:

 * A text query with 0 to n additional url parameters
 * A search engine
 * A jQuery path to access an element of the DOM resulted from the given query
 * An expected value of return and condition

The main motivation of this tool is automatically guarantee that a set of
specific answer experiences on search engines are triggering as expected.

qtester allows - and incentives - the use of a tree-like data-structure to
specify test routines, in order to avoid code repetition.

## Installing

```bash
# Add package as dependency
npm install --save qtester
# Run tests to see if everyting is fine
npm test

# Or install global binary
npm install -g qtester
```

## The Test Spec

### Basics

The input for qtester consists of a JSON object that, by convention, must
follow the format shown in the example below:

```javascript
// Tests if, when running a query through bing, the query input is placed
//  correctly in the search box
{
    "name": "TestName",  
    "testRoot": {
       "searchEngine": "bing",
       "query": "test query",
       "path": "input#sb_form_q",
       "attribute": "text",
       "condition": "equals",
       "expectedValue": "test query"
    }
};
```

The root of the object should contain a **name** string and a **testRoot**
object. The **testRoot** can consist of a single test - as shown above - or it
can consist or a tree-like object working with the **children** keyword,
which will result in the automatic generation of multiple tests, as exemplified
below:

```javascript
// This will generate two tests
// Both of them testing the search box content of bing
// But with each one presenting a different query and expected result
{
    "name": "TestName",  
    "testRoot": {
        "searchEngine": "bing",
        "path": "input#sb_form_q",
        "attribute": "text",
        "condition": "equals",
        "_children_": [
            {"query": "test query", "expectedValue": "test query"},
            {"query": "another test", "expectedValue": "another test"}
        ]
    }
};
```

### Keywords

#### name

A string placed outside the **testRoot**. Meta-data useful for describing the test.

#### testRoot

Object containg the all elements necessary for test execution. At the moment
no elements inside **testRoot** can be considered meta-data.

#### searchEngine

Currently the supported options are:
* bing
* google
* duckduckgo

Anything else should result in an error.

#### query

Query string to be executed on top of the given **searchEngine**. At the moment,
qtester only supports text-base search on each engine's web vertical.

#### path

jQuery path for accessing an element of the DOM resulting from the executed
query.

#### attribute

Which attribute should be extracted from the element obtained from the **path**.

The result of the combination of the **path** and **attribute** is what will be
compared with the **expectedValue** and **condition**.

The **attribute** can be a html attribute as is, or can be the keyword **text**
which returns the content of the element returned from the jQuery **path**.

#### expectedValue

Value that should match the result of the **path** and **attribute**
combination given the tests **condition**.

#### condition

Currently the supported conditions are:
* equals
* contains

Anything else should result in an error.

#### _children_

Special keyword that will get all same and higher level tests specifications,
and apply them to all of its child objects. The **_children_** keyword must
always be an array, or else an error should be returned.

#### [extra parameters]

On top of the minimal input necessary to run a test, the user can include as
many extra url parameters as required, given that it doesn't conlfit with any
pre-defineid test keywords.

For example:

```javascript
// This will generate a query to the following url:
//  http://www.bing;com/search?q=example&param1=value&param2=value2
{
    "name": "TestName",  
    "testRoot": {
       "searchEngine": "bing",
       "query": "example",
       "path": "input#sb_form_q",
       "attribute": "text",
       "condition": "equals",
       "expectedValue": "example",
       "param1": "value1",
       "param2": "value2"
    }
};
```

### Input types

The test spec can be passed to the qtest as three different types of input:
* As a javascript object
* As a string containing a path to a JSON file
* As a string containing a path to a javascript file. In this case, it will be
expected that such file exports only a single javascript object.

It's worth noting that the javascript file as input option offers much
flexibility, and is the recommended choice of input type.

## Working with the package

```javascript
var runTest = require('qtester');

var testSpec = {

    "name": "Example",
    "testRoot": {
        "searchEngine": "duckduckgo",
        "query": "working with the qtester package",
        "path": "input#search_form_input",
        "attribute": "text",
        "condition": "contains",
        "_children_": [
            {"expectedValue": "with the qtester"},
            {"expectedValue": "without the qtester"}
        ]
    }
};

runTest(testSpec, function(err, testResults) {

    console.log(testResults);
});

/* Output:

[
    {
        name: 'Example',
        path: 'input#search_form_input',
        query: 'working with the qtester package',
        passed: true,
        condition: 'contains',
        actualValue: 'working with the qtester package',
        expectedValue: 'with the qtester'
    },
    {
        name: 'Example',
        path: 'input#search_form_input',
        query: 'working with the qtester package',
        passed: false,
        condition: 'contains',
        actualValue: 'working with the qtester package',
        expectedValue: 'without the qtester'
    }
]
*/
```

## Working with the CLI

To run qtester from the command line, just pass a single input following one
of the [supported formats](#input-types).

```bash
# Runs an example test spec in javascript file format from command line,
#  that checks if the basic Soccer answers are being triggered as expected
qtester ./examples/soccer.js
```
