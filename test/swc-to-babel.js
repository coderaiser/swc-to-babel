'use strict';

const {join} = require('path');
const {
    readFileSync,
    writeFileSync,
} = require('fs');

const {extend} = require('supertape');
const swc = require('@swc/core');

const swcToBabel = require('..');

const json = (a) => JSON.parse(JSON.stringify(a));

const test = extend({
    jsonEqual: (operator) => (actual, expected, message = 'should jsonEqual') => {
        const {is, output} = operator.deepEqual(json(actual), json(expected));
        
        return {
            is,
            message,
            actual,
            expected,
            output,
        };
    },
});

const fixtureDir = join(__dirname, 'fixture');

const isUpdate = process.env.UPDATE;
const update = (a, json) => {
    if (!isUpdate)
        return;
    
    writeFileSync(`${fixtureDir}/${a}.json`, JSON.stringify(json, null, 4));
};

const readJS = (a) => readFileSync(join(`${fixtureDir}/${a}`), 'utf8');
const readJSON = (a) => require(`${fixtureDir}/${a}`);
const fixture = {
    ast: {
        swcModule: readJSON('swc-module.json'),
    },
    js: {
        swcModule: readJS('swc-module.js'),
    },
};

test('estree-to-babel: swc: parse: cwcModule', (t) => {
    const ast = swc.parseSync(fixture.js.swcModule);
    const result = swcToBabel(ast, fixture.js.swcModule);
    
    update('swc-module', result);
    
    t.jsonEqual(result, fixture.ast.swcModule);
    t.end();
});
